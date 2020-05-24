import { playNote } from './freq'
import React from 'react'
import ReactDOM from 'react-dom'
import io from 'socket.io-client'
import ExamsTable from './components/ExamsTable'

const downloadLink = document.getElementById('download')
const stopButton = document.getElementById('stop')
const registerButton = document.getElementById('register_student')
const idField = document.getElementById('student_id')
const nameField = document.getElementById('name')
const SERVER_URL = 'http://localhost:5000'

stopButton.addEventListener('click', function () {
  console.log('stop')
  shouldStop = true
})

var socket = io(SERVER_URL)

registerButton.onclick = function (event) {
  console.log('click')
  socket.emit('register', { id: idField.value, name: nameField.value })
}

socket.on('exam_update', function () {
  fetchAndUpdateTable()
})

socket.on('message', function (data) {
  console.log(data.id)
})

socket.on('play', function (melody) {
  console.log(melody)
  playNote(440, 5000)
})

fetchAndUpdateTable()

let shouldStop = false
let stopped = false
var recordedChunks = []
// Get record
navigator.mediaDevices.getUserMedia({
  audio: true,
  video: false
})
  .then(stream => {
    const recorder = new MediaRecorder(stream, {
      audioBitsPerSecond: 128000,
      mimeType: 'audio/webm'
    })
    recorder.ondataavailable = function (e) {
      if (e.data.size > 0) {
        recordedChunks.push(e.data)
      }

      if (shouldStop === true && stopped === false) {
        recorder.stop()
        stopped = true
      }
    }
    recorder.onstop = function (e) {
      downloadLink.href = URL.createObjectURL(new Blob(recordedChunks))
      downloadLink.download = 'acetest.webm'
    }

    recorder.start(500)
    // setInterval(() => {
    //   console.log(recorder)
    // }, 6000)
  })

function fetchAndUpdateTable () {
  let exams
  fetch(SERVER_URL + '/exam')
    .then(response => response.json())
    .then(json => {
      exams = json.result
      console.log(exams)
      ReactDOM.render((<ExamsTable rows={exams}></ExamsTable>), document.getElementById('table'))
    })
}

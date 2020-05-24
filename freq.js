function playNote (frequency, duration) {
  // create Oscillator node
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  const oscillator = audioCtx.createOscillator()

  oscillator.type = 'square'
  oscillator.frequency.value = frequency // value in hertz
  oscillator.connect(audioCtx.destination)
  oscillator.start()

  setTimeout(
    function () {
      oscillator.stop()
    }, duration)
}

function playMelody () {
  if (notes.length > 0) {
    note = notes.pop()
    playNote(note[0], note[1])
  }
}

export { playMelody, playNote }

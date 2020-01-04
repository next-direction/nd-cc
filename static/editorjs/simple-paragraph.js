class SimpleParagraph extends Paragraph {
  static get enableLineBreaks () {
    return true;
  }

  constructor (data) {
    super(data);

    this._element.addEventListener('keydown', (event) => {
      switch (event.code) {
        case 'Enter':
          event.preventDefault();
          break;
      }
    }, false);
  }
}

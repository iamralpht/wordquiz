// Word quiz; shows a word for a few seconds and you can read it out loud.

(function() {
function SpeechRecognizer(controller) {
    this._controller = controller;
    this._recentResults = document.createElement('span');
    this._recentResults.className = 'speech-results';
    if (!window.webkitSpeechRecognition) return;
    var self = this;
    this._recognition = new webkitSpeechRecognition();
    this._recognition.onstart = function(e) { console.log(e); }
    this._recognition.onerror = function(e) { console.log(e); }
    this._recognition.onresult = function(e) { self._result(e); };
    this._recognition.continuous = true;
    this._recognition.interimResults = true;
    this._recognition.start();
    this._wantedWord = "";
}
SpeechRecognizer.prototype.element = function() { return this._recentResults; }
SpeechRecognizer.prototype.setWantedWord = function(word) { this._wantedWord = word; }
SpeechRecognizer.prototype._result = function(e) {
    var interim = '';
    var confirmed = '';
    if (typeof(e.results) == 'undefined') {
        this._recognition.stop();
        return;
    }
    for (var i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) confirmed += event.results[i][0].transcript;
        else interim += event.results[i][0].transcript;
    }
    var everything = confirmed + ' ' + interim;
    this._recentResults.textContent = everything;
    if (this._wantedWord.length == 0) return;

    var lowerEverything = everything.toLowerCase();
    var idx = lowerEverything.indexOf(this._wantedWord);
    if (everything.toLowerCase().indexOf(this._wantedWord) != -1)
        this._controller.next();

}
function QuizPage(controller, word) {
    this._root = document.createElement('div');
    this._root.className = 'quiz-page';
    this._word = document.createElement('span');
    this._word.className = 'word';
    this._word.innerText = word;
    this._root.appendChild(this._word);
    this._timer = document.createElement('div');
    this._timer.className = 'timer';
    this._root.appendChild(this._timer);

    function next() { controller.next(); }; // Better to do controller.next.bind(controller); doesn't work on iOS 5.
    this._timer.addEventListener('webkitAnimationEnd', next, false);
    this._root.addEventListener('click', next, false);
}
QuizPage.prototype.element = function() { return this._root; }
function shuffle(array) {
    var tmp, current, top = array.length;

    if(top) while(--top) {
    	current = Math.floor(Math.random() * (top + 1));
    	tmp = array[current];
    	array[current] = array[top];
    	array[top] = tmp;
    }

    return array;
}
function QuizController() {
    this._words = shuffle(words);
    this._index = -1;
    this._speech = new SpeechRecognizer(this);
    this.next();
    document.body.appendChild(this._speech.element());
}
QuizController.prototype.next = function() {
    if (this._page) {
        document.body.removeChild(this._page.element());
    }
    this._index = (this._index + 1) % this._words.length;
    this._page = new QuizPage(this, this._words[this._index]);
    this._speech.setWantedWord(this._words[this._index]);
    document.body.appendChild(this._page.element());
}
window.onload = function onload() { new QuizController(); }
})();

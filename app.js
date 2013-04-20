// Word quiz; shows a word for a few seconds and you can read it out loud.

(function() {
function QuizPage(controller, word) {
    this._root = document.createElement('div');
    this._root.className = 'quiz-page';
    this._word = document.createElement('span');
    this._word.className = 'word';
    this._word.innerText = word;
    this._root.appendChild(this._word);
    this._timer = document.createElement('div');
    this._timer.className = 'timer';
    this._timer.addEventListener('webkitAnimationEnd',
        function() { controller.next(); }, false);
    this._root.appendChild(this._timer);
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
    this.next();
}
QuizController.prototype.next = function() {
    if (this._page) {
        document.body.removeChild(this._page.element());
    }
    this._index = (this._index + 1) % this._words.length;
    this._page = new QuizPage(this, this._words[this._index]);
    document.body.appendChild(this._page.element());
}
window.onload = function onload() { new QuizController(); }
})();

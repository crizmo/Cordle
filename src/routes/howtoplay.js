export const howtoplay = `
<div class="text-column">
    <style>
        span {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            font-size: 0.8em;
            width: 2.4em;
            height: 2.4em;
            background-color: white;
            box-sizing: border-box;
            border-radius: 2px;
            border-width: 2px;
            color: rgba(0, 0, 0, 0.7);
        }

        .missing {
            background: #3a3a3c;
            color: white;
        }

        .close {
            background: var(--color-theme-1);
            color: white;
        }

        .exact {
            background: var(--color-theme-2);
            color: white;
        }

        .example {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 1rem 0;
            gap: 0.2rem;
        }

        .example span {
            font-size: 1.4rem;
        }

        p span {
            position: relative;
            border-width: 1px;
            border-radius: 1px;
            font-size: 0.4em;
            transform: scale(2) translate(0, -10%);
            margin: 0 1em;
        }

        .wordle {
            color: var(--color-theme-2);
        }
    </style>
    <p>
        Cordle is a similar to <a class="wordle" href="https://www.nytimes.com/games/wordle/index.html">Wordle</a>, the
        word guessing game. The difference is that in Cordle you have you guess words related to code.
    </p>

    <div class="example">
        <span class="exact">d</span>
        <span class="missing">r</span>
        <span class="missing">a</span>
        <span class="close">g</span>
        <span class="missing">s</span>
    </div>

    <p>
        The <span class="exact">d</span> is in the right place.
        <span class="close">g</span>
        is the right letter, but in the wrong place. The other letters are wrong, and can be discarded.
        Let's make another guess:
    </p>

    <div class="example">
        <span class="exact">d</span>
        <span class="exact">e</span>
        <span class="exact">b</span>
        <span class="exact">u</span>
        <span class="exact">g</span>
    </div>

    <p>This time we guessed right! You have <strong>six</strong> guesses to get the word.</p>
</div>
`;
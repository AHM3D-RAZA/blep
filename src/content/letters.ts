import type { LetterContent } from '../types/content';

/**
 * Letter content. Each letter is a list of pages, each page a list of
 * paragraphs. The envelope/letter modules should render these directly
 * rather than hardcoding any text in components.
 */

export const letterOne: LetterContent = {
  id: 'letterOne',
  title: 'the first letter',
  pages: [
    {
      id: 'letterOne-page-1',
      heading: 'to start with',
      // Example: this photo (from content/photos.ts) now shows right
      // after this page's text, before "letterOne-page-2" begins — add
      // more ids here, or to any other page, the same way.
      photoIds: ['photo-1'],
      body: ['alright this took way longer than i expected. sowwy about zat haha. but there are a few things i would like to say. issu, i really love you alot. i love you so so much that its crazy to think that a few months ago i was totally foreign to feeling love, loving someone, being loved etc. love was just a concept, a theory to me you know. and now its an everyday feeling where if i dont tell you, or hear you say it, my day becomes restless. i am really glad to have been introduced to such a kewl thing by such a beautiful person.'],
    },
    {
      id: 'letterOne-page-2',
      heading: 'i will always love you',
      photoIds: ['photo-2', 'photo-3'],
      body: ['i really hope you keep loving me (and only me please) for my whole life. but regardless, i will still love you alot no matter what. cause really, i dont even know what else to do now. loving you is not just a part of me issu, it now makes the whole of me. i am a manifestation of the love i have for you. and what a beautiful thing it is, only because my love is associated with you. you make everything that you touch, associate yourself with, hold dear, put your eyes on, seem so beautiful to me. only because all those are related to you. i love you so much issu.'],
    },
    {
      id: 'letterOne-page-3',
      heading: 'before you hear me',
      body: ['so the audio you are about to hear has been in writing since uhh we met. the first time i told you about my page and me writing raps, you said that i should start again. and damn, ever since the start i cant refuse you, instead i start looking for ways to do that. so that is what it did. i started writing this on March 10 (i saw from the phones notes app hehe). i remember at that time i was already staying up till 5 6 am, and i would write this in the morning, then record those lines just so i dont forget the melody.'],
    },
    {
      id: 'letterOne-page-4',
      heading: 'a little background',
      photoIds: ['photo-4', 'photo-5'],
      body: ['i was going to leave this behind for you as a goodbye gift when i went. but haha i got lazy after i decided to stay, otherwise this wouldve been finished in like a few weeks. but even then, this audio has been finished since like 27 June. yup, i stayed up the whole night recording and putting it together, editing it. and ofcourse you will still hear noises and background music dang, sowwy about that as you know i dont have a studio setup haha. and theres no music. yup. just raw vocals (thats why i keep telling you, learn the guitar quick so we ken finish this one together plijj).'],
    },
    {
      id: 'letterOne-page-5',
      heading: 'the things i do for you (happily, whole-heartedly)',
      body: ['and damn you dont even know how it felt listening to my own raw voice, over and over again when i was editing it. the things i do for you. hehe. oh and this whole thing, written by me. specifically for you. some lines were written before i was gonna go, so you might find some hints of that dang haha. and the other lines were completed after, like around 25-27 June. i might do a lyrics thing where i write them in a pdf and highlight both in different colors if i get the time (wont tell you whish is whish). but, ENJOY. or rather, sowwy for bleeding your ears hehe.'],
    },
  ],
};

export const letterTwo: LetterContent = {
  id: 'letterTwo',
  title: 'the second letter',
  pages: [
    {
      id: 'letterTwo-page-1',
      heading: 'if you\u2019re still here with me',
      // Example: same mechanism as Letter One — add photo ids to any
      // page's `photoIds` and it shows right after that page's text.
      photoIds: ['photo-6', 'photo-7'],
      body: [ 
        'hehe. i am sowwy if it was bad. or if you did not like it. i mean its nothing much, but its honest work. you know i thought of so many things to say in this project, but dang it took so long to ready it that i have forgotten about it by now. i wish i could stop time whenever i am with you. just stop. so you would only think of me without any distractions, and i would only think of you without any distractions, and we could just be with each other, fully, wholly, forever. i just want to be with you forever issu. and i want you to be with me forever too. fully with me. just e and me alone.'
            ],
    },
    {
      id: 'letterTwo-page-2',
      heading: 'i am so selfish',
      photoIds: ['photo-8', 'photo-9'],
      body: [
        'i am so fucking selfish you know. haha. i dont want you to be with anyone else. i want you to only talk to me and me alone. i want you to just think about me all the time. i want you to just want to be with me and no one else all the time. i want you to only miss me and me alone. i want you to just laugh and smile with me. i want you to just be with me when you are not well, and when you are happy. i want you to do everything with me. i am so so selfish. i just want to be enough for you. in everything. that you dont ever feel the need, nor the want to even think of anyone else. i want you to share everything and anything with just me and me alone, no one else. i want you all to myself so badly. i get jealous of even the strangers who get to be around you. i know this is terrible and i know it must be hard to tolerate this, my possessiveness, obsessiveness and my jealousy. i must sound so pathetic and such a loser haha. but i cant help it. idk why it is like this. it not fair to you either. damnit.'
      ],
    },
    {
      id: 'letterTwo-page-3',
      heading: 'thank you issu',
      photoIds: ['photo-10', 'photo-11', 'photo-12'],
      body: [
        'you know you make my day so much better, so much easier when you are with me. you make the things i usually find intolerable seem like alright. its like ever since you came along, all the things around my life seem to have eased out a bit. the world has started to seem soft, more forgiving. the days are a bit easier, and when you are with me they are the easiest. i dont know why i always say this when i should but you are the sole reason somehow i can still hold onto my life. and i notice the things you do for me issu. all of them. i notice all of you. and i am really thankful to you issu. for everything. for noting. for all that is in between. and i thank God for your existence around my time. and i thank the universe that we met. i love you alot issu. so much. too much. very very much.'
      ],
    },
    {
      id: 'letterTwo-page-4',
      heading: 'and sorry',
      body: [
        'issu, me ish sorry for all the hurt, sadness, crying, bad feeling i have caused you. even if it was a little bit. i am so sorry about it. and i am sorry if in the future i do something again. please forgive me, and know that i never do anything like this intentionally. its always like i dont know somethings and i dont know how to handle. i am just bad at it. i have never had a real relationship with anyone except fam, and haha with fam i am mostly on the other end. so i dont know what to do when someone gets sad because of me. i have hurt many people, made many sad, but never have i felt this bad about it. and i dont think i have stayed much after to ask forgiveness. i am a really terrible person. but issu, i am really sorry if i did something like this ever, please forgive. and you know honestly i try to be so much better with every passing day, and i wish i can be better so you dont have to get sad or cry because of me. i wish i can be enough for you one day.'
      ],
    },
    {
      id: 'letterTwo-page-5',
      heading: 'I LOVE YOU CUPCAKE',
      body: [
      ],
    },
  ],
};

export const letters: LetterContent[] = [letterOne, letterTwo];

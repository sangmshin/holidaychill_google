// Copyright 2017, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * This file contains the constant strings to be used in the code logic to allow for easy editing
 * Below are eslint comments to enforce JSON like syntax since strings are usually stored in JSON
 * They are written in JavaScript for easier organization of the data and in case functions are used
 */

/* eslint quote-props: ["error", "always"] */
/* eslint quotes: ["error", "double"] */

// eslint-disable-next-line quotes
const deepFreeze = require('deep-freeze');

const categories = [
  {
    "category": "meditation",
    "suggestion": "Meditation",
    "facts": [
      "<audio src='https://s3.amazonaws.com/holidaychillin/script1.mp3'><desc>Meditation with Jack Frost</desc></audio>",
      "<audio src='https://s3.amazonaws.com/holidaychillin/script2.mp3'><desc>Meditation with Jack Frost</desc></audio>",
      "<audio src='https://s3.amazonaws.com/holidaychillin/script3.mp3'><desc>Meditation with Jack Frost</desc></audio>",
      "<audio src='https://s3.amazonaws.com/holidaychillin/script4.mp3'><desc>Meditation with Jack Frost</desc></audio>"
    ],
    "factPrefix": "",
    "nextFact": "Would you like to meditate with Jack Frost again or listen to the sounds of winter?"
  },
  {
    "category": "sounds of winter",
    "suggestion": "Sounds of Winter",
    "facts": [
      "<audio src='https://s3.amazonaws.com/holidaychillin/fireplace.mp3'><desc>You are listening to the Sounds of Winter.</desc></audio>"
    ],
    "factPrefix": "<audio src='https://s3.amazonaws.com/holidaychillin/fireplace_intro.mp3'></audio>",
    "nextFact": "Would you like to meditate with Jack Frost or listen to the sounds of winter again?"
  }
];

const content = {
  "images": [
    [
      "https://s3.amazonaws.com/holidaychillin/Holiday_Chill.png",
      "Meditation with Jack Frost"
    ],
    [
      "https://s3.amazonaws.com/holidaychillin/page2_hc_logo.jpg",
      "Holiday Chill"
    ]
  ],
  "link": "https://www.theholidaychill.com"
};

const general = {
  // "heardItAll": "Actually it looks like you heard it all. Thanks for listening!",
  "noInputs": [
    "Would you like to meditate with Jack Frost or listen to the sounds of winter?"
  ],
  "suggestions": {
    "confirmation": [
      "Meditation",
      "Sounds of Winter"
    ]
  },
  "nextFact": "Would you like to meditate with Jack Frost again or listen to the sounds of winter?",
  "linkOut": "Learn more",
  "unhandled": "I must have snow in my ears. You can ask me for meditation with Jack Frost or the sounds of winter."
};
var unknownValueHandler = [
  "I must have snow in my ears. You can ask me for meditation with Jack Frost or the sounds of winter.",
  "I must have snow in my ears. Would you like to meditate with Jack Frost or listen to the sounds of winter?",
  "You can ask me for meditation with Jack Frost or the sounds of winter.",
  "Would you like to meditate with Jack Frost or listen to the sounds of winter?"
];
// Use deepFreeze to make the constant objects immutable so they are not unintentionally modified
module.exports = deepFreeze({
  categories,
  content,
  general,
  unknownValueHandler
});

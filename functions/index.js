// Copyright 2016, Google, Inc.
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

'use strict';

const { DialogflowApp } = require('actions-on-google');
const functions = require('firebase-functions');
const { sprintf } = require('sprintf-js');

const strings = require('./strings');

process.env.DEBUG = 'actions-on-google:*';

/** Dialogflow Actions {@link https://dialogflow.com/docs/actions-and-parameters#actions} */
const Actions = {
  UNRECOGNIZED_DEEP_LINK: 'deeplink.unknown',
  MEDITATE_INTENT: 'meditate.intent',
  SOW_INTENT: 'soundsOfWinter.intent'
};
/** Dialogflow Parameters {@link https://dialogflow.com/docs/actions-and-parameters#parameters} */
const Parameters = {
  CATEGORY: 'category'
};

/**
 *
 * The array to get a random value from
 */
const getRandomValue = array => array[Math.floor(Math.random() * array.length)];

/** The array of facts to choose a fact from */
const getRandomFact = facts => {
  if (!facts.length) {
    return null;
  }
  const fact = getRandomValue(facts);
  // Delete the fact from the local data since we now already used it
  // facts.splice(facts.indexOf(fact), 1);
  return fact;
};

/** @param {Array<string>} messages The messages to concat */
const concat = messages => messages.map(message => message.trim()).join(' ');

// Polyfill Object.values to get the values of the keys of an object
if (!Object.values) {
  Object.values = o => Object.keys(o).map(k => o[k]);
}

// Unhandled Intent/Value handler - connected to 'In Dialog Fallback' Intent in Dialogflow
const unhandledDeepLinks = app => {
  const rawInput = app.getRawInput();
  const response = sprintf(getRandomUnknownValueHandler(), rawInput);
  const screenOutput = app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT);
  if (!screenOutput) {
    return app.ask(response, strings.general.noInputs);
  }
  // const suggestions = strings.categories.map(category => category.suggestion);
  const richResponse = app.buildRichResponse()
    .addSimpleResponse(response)
    .addSuggestions(strings.general.suggestions.confirmation);

  app.ask(richResponse, strings.general.noInputs);
};

function getRandom (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomUnknownValueHandler () {
  return strings.unknownValueHandler[getRandom(0, strings.unknownValueHandler.length - 1)];
}
/**
 * @typedef {Object} FactsData
 * @prop {{[category: string]: Array<string>}} content
 * @prop {Array<string> | null} cats
 */

/**
 * @typedef {Object} AppData
 * @prop {FactsData} facts
 */

/**
 * Set up app.data for use in the action
 * @param {DialogflowApp} app DialogflowApp instance
 */
const initData = app => {
  /** @type {AppData} */
  const data = app.data;
  if (!data.facts) {
    data.facts = {
      content: {},
      cats: null
    };
  }
  return data;
};

/// /////////////////////////////////////////////////
/// /////////////////////////////////////////////////
/// /////////////////////////////////////////////////
/// /////////////////////////////////////////////////
/**
 * MEDITATION & SOUNDS OF WINTER INTENT
 */
/// /////////////////////////////////////////////////
/// /////////////////////////////////////////////////
/// /////////////////////////////////////////////////
/// /////////////////////////////////////////////////
var currentIntent = 'beginning';

const meditate = app => {
  currentIntent = app.getIntent();

  const data = initData(app);
  const facts = data.facts.content;
  for (const category of strings.categories) {
    // Initialize categories with all the facts if they haven't been read
    if (!facts[category.category]) {
      facts[category.category] = category.facts.slice();
    }
  }
  if (Object.values(facts).every(category => !category.length)) {
    // If every fact category facts stored in app.data is empty
    // return app.tell(strings.general.heardItAll);
  }
  const parameter = Parameters.CATEGORY;
  const factCategory = app.getArgument(parameter);
  const screenOutput = app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT);
  const category = strings.categories.find(c => c.category === factCategory);
  if (!category) {
    const action = app.getIntent();
    console.error(`${parameter} parameter is unrecognized or ` +
      `not provided by Dialogflow ${action} action`);
    return;
  }
  const fact = getRandomFact(facts[category.category]);

  const factPrefix = category.factPrefix;

  /// ////////////////////////////////////////
  // FOR GOOGLE HOME////////////////////////
  /// ////////////////////////////////////////
  if (!screenOutput) {
    // return app.ask(`<speak>${concat([factPrefix, fact, strings.general.nextFact])}</speak>`, strings.general.noInputs);
    return app.ask(`<speak>${concat([factPrefix, fact, category.nextFact])}</speak>`, strings.general.noInputs);
  }

  /// ////////////////////////////////////////
  // FOR PHONES WITH SCREEN /////////////////
  /// ////////////////////////////////////////
  const image = getRandomValue(strings.content.images);
  const [url, name] = image;
  const card = app.buildBasicCard(fact)
    .addButton(strings.general.linkOut, strings.content.link)
    .setImage(url, name);

  const richResponse = app.buildRichResponse()
    .addSimpleResponse(`<speak>${concat([factPrefix, fact])}</speak>`)
    .addBasicCard(card)
    .addSimpleResponse(category.nextFact)
    .addSuggestions(strings.general.suggestions.confirmation);

  app.ask(richResponse, strings.general.noInputs);
  return currentIntent;
};

const soundsOfWinter = app => {
  currentIntent = app.getIntent();

  const data = initData(app);
  const facts = data.facts.content;
  for (const category of strings.categories) {
    // Initialize categories with all the facts if they haven't been read
    if (!facts[category.category]) {
      facts[category.category] = category.facts.slice();
    }
  }
  if (Object.values(facts).every(category => !category.length)) {
    // If every fact category facts stored in app.data is empty
    // return app.tell(strings.general.heardItAll);
  }
  const parameter = Parameters.CATEGORY;
  const factCategory = app.getArgument(parameter);
  const screenOutput = app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT);
  const category = strings.categories.find(c => c.category === factCategory);
  if (!category) {
    const action = app.getIntent();
    console.error(`${parameter} parameter is unrecognized or ` +
      `not provided by Dialogflow ${action} action`);
    return;
  }
  const fact = getRandomFact(facts[category.category]);

  const factPrefix = category.factPrefix;

  /// ////////////////////////////////////////
  // FOR GOOGLE HOME////////////////////////
  /// ////////////////////////////////////////
  if (!screenOutput) {
    // return app.ask(`<speak>${concat([factPrefix, fact, strings.general.nextFact])}</speak>`, strings.general.noInputs);
    return app.ask(`<speak>${concat([factPrefix, fact, category.nextFact])}</speak>`, strings.general.noInputs);
  }

  /// ////////////////////////////////////////
  // FOR PHONES WITH SCREEN /////////////////
  /// ////////////////////////////////////////
  const image = getRandomValue(strings.content.images);
  const [url, name] = image;
  const card = app.buildBasicCard(fact)
    .addButton(strings.general.linkOut, strings.content.link)
    .setImage(url, name);

  const richResponse = app.buildRichResponse()
    .addSimpleResponse(`<speak>${concat([factPrefix, fact])}</speak>`)
    .addBasicCard(card)
    .addSimpleResponse(category.nextFact)
    .addSuggestions(strings.general.suggestions.confirmation);

  app.ask(richResponse, strings.general.noInputs);
  return currentIntent;
};

const STARTOVER_INTENT = 'startOver.intent';

function startOver (app) {
  var say;
  // const intent = app.getIntent();
  // const argument = app.getArgument();
  if (currentIntent === 'beginning') {
    say = `Okay, going all the way back to the beginning. <break time="2s"/> The holidays can be the most stressful time of year, but Jack Frost is here to help spread some holiday chill. Would you like to meditate with Jack Frost or listen to the sounds of Winter?`;
  }
  if (currentIntent === 'meditate.intent') {
    say = 'Would you like to restart the meditation, or go all the way back to the beginning?';
  }
  if (currentIntent === 'soundsOfWinter.intent') {
    say = 'Would you like to listen to the sounds of winter again, or go all the way back to the beginning?';
  }
  app.ask(`<speak>${say}</speak>`, strings.general.noInputs);
}

/** @type {Map<string, function(DialogflowApp): void>} */
const actionMap = new Map();
actionMap.set(Actions.UNRECOGNIZED_DEEP_LINK, unhandledDeepLinks);
actionMap.set(Actions.MEDITATE_INTENT, meditate);
actionMap.set(Actions.SOW_INTENT, soundsOfWinter);
actionMap.set(STARTOVER_INTENT, startOver);

/**
 * The entry point to handle a http request
 * @param {Request} request An Express like Request object of the HTTP request
 * @param {Response} response An Express like Response object to send back data
 */
const holidayChill = functions.https.onRequest((request, response) => {
  const app = new DialogflowApp({ request, response });
  console.log(`Request headers: ${JSON.stringify(request.headers)}`);
  console.log(`Request body: ${JSON.stringify(request.body)}`);
  app.handleRequest(actionMap);
});

module.exports = {
  holidayChill
};

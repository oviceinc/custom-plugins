# Custom Plugins for ovice

## Contents

- [Overview](#overview)
- [Getting Started with Examples](#getting-started-with-examples)
- [Understanding Events](#understanding-events)
  - [Status Events](#status-events)
  - [Participant Related Events](#participant-related-events)
  - [Events Related to Other Participants](#events-related-to-other-participants)
  - [Real-time Communication Events](#real-time-communication-events)
  - [Event for Event Reflection](#event-for-event-reflection)
  - [Initial connection Events](#initial-connection-events)

## Overview

This repository is aimed at developers who are interested in creating Custom Plugins for ovice, a platform that enables real-time interactions through a communication system leveraging iframe postMessage. The system provides a set of events to handle user participation, access participant information, and facilitate custom communication among users. It is designed to help developers integrate features easily and improve the user experience when interconnecting different domains.

## Getting Started with Examples

Here are some examples of plugins you can use as a reference for developing your own:

| Plugin Name                                | Description                                                    |
| ------------------------------------------ | -------------------------------------------------------------- |
| [Meeting Cash Clock](./meeting-cash-clock) | A tool to monitor meeting cost in real-time.                   |
| [RSS Reader](./rss-reader)                 | An RSS feed plugin to read news or articles within ovice.      |
| [Sound Track](./soundtrack/)               | A plugin to play background music or soundtracks in the space. |

## Understanding Events

### Status Events

These events notify about the status of users interacting with objects within ovice:

#### `subscribed`

User is within the range of the object but not linked.

https://github.com/oviceinc/custom-plugins/assets/15701307/55e5ed76-7495-4502-93db-ab8d5f509ad1

#### `joined`

User is linked to the object.

https://github.com/oviceinc/custom-plugins/assets/15701307/f7c9ea47-356f-4917-8563-0425441ec2c0

#### `left`

User was linked but left the object.

https://github.com/oviceinc/custom-plugins/assets/15701307/e35fd892-ac83-4a41-9560-fe4c0edf50a4

#### `unsubscribed`

User was linked or within the range of the object but moved out of range.

https://github.com/oviceinc/custom-plugins/assets/15701307/548a1c05-53cf-46d2-aeb1-1aaafe070732

### Initial connection Events

Events related to establishing the initial connection with ovice:

| Event Name                                                                                | Triggered By  |
| :---------------------------------------------------------------------------------------- | :------------ |
| [ovice_ready](./docs/technical_details_for_developers.md#ovice_ready)                     | Client Domain |
| [ovice_confirmation](./docs/technical_details_for_developers.md#ovice_confirmation)       | ovice Domain  |
| [ovice_ready_confirmed](./docs/technical_details_for_developers.md#ovice_ready_confirmed) | Client Domain |

### Participant Related Events

Events triggered by the ovice domain related to the actions of a participant:

| Event Name                                                                                                  | Triggered By |
| :---------------------------------------------------------------------------------------------------------- | :----------- |
| [ovice_participant_subscribed](./docs/technical_details_for_developers.md#ovice_participant_subscribed)     | ovice Domain |
| [ovice_participant_unsubscribed](./docs/technical_details_for_developers.md#ovice_participant_unsubscribed) | ovice Domain |
| [ovice_participant_joined](./docs/technical_details_for_developers.md#ovice_participant_joined)             | ovice Domain |
| [ovice_participant_left](./docs/technical_details_for_developers.md#ovice_participant_left)                 | ovice Domain |

### Events Related to Other Participants

Events triggered by the ovice domain related to the actions of other participants:

| Event Name                                                                                                              | Triggered By |
| :---------------------------------------------------------------------------------------------------------------------- | :----------- |
| [ovice_other_participant_subscribed](./docs/technical_details_for_developers.md#ovice_other_participant_subscribed)     | ovice Domain |
| [ovice_other_participant_unsubscribed](./docs/technical_details_for_developers.md#ovice_other_participant_unsubscribed) | ovice Domain |
| [ovice_other_participant_joined](./docs/technical_details_for_developers.md#ovice_other_participant_joined)             | ovice Domain |
| [ovice_other_participant_left](./docs/technical_details_for_developers.md#ovice_other_participant_left)                 | ovice Domain |

### Events for Participant Information

Events designed to retrieve information about participants:

| Event Name                                                                                  | Triggered By  |
| :------------------------------------------------------------------------------------------ | :------------ |
| [ovice_get_participants](./docs/technical_details_for_developers.md#ovice_get_participants) | Client Domain |
| [ovice_participants](./docs/technical_details_for_developers.md#ovice_participants)         | ovice Domain  |

### Real-time Communication Events

Events facilitating real-time communication between participants:
| Event Name | Triggered By |
| :---------------------------------------------------------------------------------------- | :------------ |
| [ovice_emit_to_others](./docs/technical_details_for_developers.md#ovice_emit_to_others) | Client Domain |
| [ovice_emit_to](./docs/technical_details_for_developers.md#ovice_emit_to) | Client Domain |

### Event for Event Reflection

An event meant to reflect messages between participants:

| Event Name                                                                            | Triggered By |
| :------------------------------------------------------------------------------------ | :----------- |
| [ovice_event_message](./docs/technical_details_for_developers.md#ovice_event_message) | ovice Domain |

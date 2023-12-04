# Custom Plugins

## **Overview**

This repository is for sharing samples for developing Custom Plugins for ovice.

The communication system facilitates real-time interaction between two domains using iframe postMessage. Events are exchanged to manage participants, gather participant information, and enable custom communication between users. This system allows seamless integration for developers to enhance user experiences across different domains.

## **Examples**

| name                                       | description |
| :----------------------------------------- | :---------- |
| [Meeting Cash Clock](./meeting-cash-clock) |             |
| [RSS Reader](./rss-reader)                 |             |
| [Sound Track](./soundtrack/)               |             |

## **Events**

### **Additional Information for Status:**

- **"subscribed":** User is within the range of the object but not linked.

    https://github.com/oviceinc/custom-plugins/assets/15701307/55e5ed76-7495-4502-93db-ab8d5f509ad1


- **"joined":** User is linked to the object.

    https://github.com/oviceinc/custom-plugins/assets/15701307/f7c9ea47-356f-4917-8563-0425441ec2c0


- **"left":** User was linked but left the object.

    https://github.com/oviceinc/custom-plugins/assets/15701307/e35fd892-ac83-4a41-9560-fe4c0edf50a4


- **"unsubscribed":** User was linked or within the range of the object but moved out of range.

    https://github.com/oviceinc/custom-plugins/assets/15701307/548a1c05-53cf-46d2-aeb1-1aaafe070732



### **Events Related to Participant**

| event                                                                                                         | sender       |
| :------------------------------------------------------------------------------------------------------------ | :----------- |
| [`ovice_participant_subscribed`](./docs/technical_details_for_developers.md#ovice_participant_subscribed)     | ovice Domain |
| [`ovice_participant_unsubscribed`](./docs/technical_details_for_developers.md#ovice_participant_unsubscribed) | ovice Domain |
| [`ovice_participant_joined`](./docs/technical_details_for_developers.md#ovice_participant_joined)             | ovice Domain |
| [`ovice_participant_left`](./docs/technical_details_for_developers.md#ovice_participant_left)                 | ovice Domain |

### **Events Related to other Participant**

| event                                                                                                                     | sender       |
| :------------------------------------------------------------------------------------------------------------------------ | :----------- |
| [`ovice_other_participant_subscribed`](./docs/technical_details_for_developers.md#ovice_other_participant_subscribed)     | ovice Domain |
| [`ovice_other_participant_unsubscribed`](./docs/technical_details_for_developers.md#ovice_other_participant_unsubscribed) | ovice Domain |
| [`ovice_other_participant_joined`](./docs/technical_details_for_developers.md#ovice_other_participant_joined)             | ovice Domain |
| [`ovice_other_participant_left`](./docs/technical_details_for_developers.md#ovice_other_participant_left)                 | ovice Domain |

### **Events for Participant Information Retrieval**

| event                                                                                         | sender        |
| :-------------------------------------------------------------------------------------------- | :------------ |
| [`ovice_get_participants`](./docs/technical_details_for_developers.md#ovice_get_participants) | Client Domain |
| [`ovice_participants`](./docs/technical_details_for_developers.md#ovice_participants)         | ovice Domain  |

### Real-time Communication Events

| event                                                                                     | sender        |
| :---------------------------------------------------------------------------------------- | :------------ |
| [`ovice_emit_to_others`](./docs/technical_details_for_developers.md#ovice_emit_to_others) | Client Domain |
| [`ovice_emit_to`](./docs/technical_details_for_developers.md#ovice_emit_to)               | Client Domain |

### Reflection Event

| event                                                                                   | sender       |
| :-------------------------------------------------------------------------------------- | :----------- |
| [`ovice_event_message`](./docs/technical_details_for_developers.md#ovice_event_message) | ovice Domain |

### Initial connection event (in preparation)

| event                                                                                       | sender        |
| :------------------------------------------------------------------------------------------ | :------------ |
| [`ovice_ready`](./docs/technical_details_for_developers.md#ovice_ready)                     | Client Domain |
| [`ovice_confirmation`](./docs/technical_details_for_developers.md#ovice_confirmation)       | ovice Domain  |
| [`ovice_ready_confirmed`](./docs/technical_details_for_developers.md#ovice_ready_confirmed) | Client Domain |

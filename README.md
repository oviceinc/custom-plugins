# Custom Plugins

## **Examples**

| name                                       | description |
| :----------------------------------------- | :---------- |
| [Meeting Cash Clock](./meeting-cash-clock) |             |
| [RSS Reader](./rss-reader)                 |             |
| [Sound Track](./soundtrack/)               |             |

## **Events**

### **Additional Information for Status:**

- **"subscribed":** User is within the range of the object but not linked.
- **"joined":** User is linked to the object.
- **"left":** User was linked but left the object.
- **"unsubscribed":** User was linked or within the range of the object but moved out of range.

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

## **Events for Participant Information Retrieval**

| event                                                                                         | sender        |
| :-------------------------------------------------------------------------------------------- | :------------ |
| [`ovice_get_participants`](./docs/technical_details_for_developers.md#ovice_get_participants) | Client Domain |
| [`ovice_participants`](./docs/technical_details_for_developers.md#ovice_participants)         | ovice Domain  |

## Real-time Communication Events

| event                                                                                     | sender        |
| :---------------------------------------------------------------------------------------- | :------------ |
| [`ovice_emit_to_others`](./docs/technical_details_for_developers.md#ovice_emit_to_others) | Client Domain |
| [`ovice_emit_to`](./docs/technical_details_for_developers.md#ovice_emit_to)               | Client Domain |

## Reflection Event

| event                                                                                   | sender       |
| :-------------------------------------------------------------------------------------- | :----------- |
| [`ovice_event_message`](./docs/technical_details_for_developers.md#ovice_event_message) | ovice Domain |

## Initial connection event (in preparation)

| event                                                                                       | sender        |
| :------------------------------------------------------------------------------------------ | :------------ |
| [`ovice_ready`](./docs/technical_details_for_developers.md#ovice_ready)                     | Client Domain |
| [`ovice_confirmation`](./docs/technical_details_for_developers.md#ovice_confirmation)       | ovice Domain  |
| [`ovice_ready_confirmed`](./docs/technical_details_for_developers.md#ovice_ready_confirmed) | Client Domain |

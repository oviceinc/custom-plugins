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

| event                                                                                                         |
| :------------------------------------------------------------------------------------------------------------ |
| [`ovice_participant_subscribed`](./docs/technical_details_for_developers.md#ovice_participant_subscribed)     |
| [`ovice_participant_unsubscribed`](./docs/technical_details_for_developers.md#ovice_participant_unsubscribed) |
| [`ovice_participant_joined`](./docs/technical_details_for_developers.md#ovice_participant_joined)             |
| [`ovice_participant_left`](./docs/technical_details_for_developers.md#ovice_participant_left)                 |

### **Events Related to other Participant**

| event                                                                                                                     |
| :------------------------------------------------------------------------------------------------------------------------ |
| [`ovice_other_participant_subscribed`](./docs/technical_details_for_developers.md#ovice_other_participant_subscribed)     |
| [`ovice_other_participant_unsubscribed`](./docs/technical_details_for_developers.md#ovice_other_participant_unsubscribed) |
| [`ovice_other_participant_joined`](./docs/technical_details_for_developers.md#ovice_other_participant_joined)             |
| [`ovice_other_participant_left`](./docs/technical_details_for_developers.md#ovice_other_participant_left)                 |

## **Events for Participant Information Retrieval**

| event                                                                                         |
| :-------------------------------------------------------------------------------------------- |
| [`ovice_get_participants`](./docs/technical_details_for_developers.md#ovice_get_participants) |
| [`ovice_participants`](./docs/technical_details_for_developers.md#ovice_participants)         |

## Real-time Communication Events

| event                                                                                     |
| :---------------------------------------------------------------------------------------- |
| [`ovice_emit_to_others`](./docs/technical_details_for_developers.md#ovice_emit_to_others) |
| [`ovice_emit_to`](./docs/technical_details_for_developers.md#ovice_emit_to)               |

## Reflection Event

| event                                                                                   |
| :-------------------------------------------------------------------------------------- |
| [`ovice_event_message`](./docs/technical_details_for_developers.md#ovice_event_message) |

## Initial connection event (in preparation)

| event                                                                                       |
| :------------------------------------------------------------------------------------------ |
| [`ovice_ready`](./docs/technical_details_for_developers.md#ovice_ready)                     |
| [`ovice_confirmation`](./docs/technical_details_for_developers.md#ovice_confirmation)       |
| [`ovice_ready_confirmed`](./docs/technical_details_for_developers.md#ovice_ready_confirmed) |

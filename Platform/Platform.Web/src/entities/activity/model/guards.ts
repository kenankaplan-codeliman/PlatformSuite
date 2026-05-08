import type {
  ActivityDetailItem,
  AppointmentActivityDetail,
  EmailActivityDetail,
  PhoneCallActivityDetail,
  TaskActivityDetail,
} from './types';

export function isPhoneCallActivity(a: ActivityDetailItem): a is PhoneCallActivityDetail {
  return a.activityType === 'PhoneCall';
}

export function isTaskActivity(a: ActivityDetailItem): a is TaskActivityDetail {
  return a.activityType === 'Task';
}

export function isAppointmentActivity(a: ActivityDetailItem): a is AppointmentActivityDetail {
  return a.activityType === 'Appointment';
}

export function isEmailActivity(a: ActivityDetailItem): a is EmailActivityDetail {
  return a.activityType === 'Email';
}

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useFormContext,
  useWatch,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { Alert } from '../../../../shared/ui/feedback/Alert';
import {
  DetailPageLayout,
  type DetailPageTab,
} from '../../../../shared/ui/detail-page/DetailPageLayout';
import { FormSection } from '../../../../shared/ui/form/FormSection';
import { FormRow } from '../../../../shared/ui/form/FormRow';
import { TextField } from '../../../../shared/ui/form/fields/TextField';
import { TextAreaField } from '../../../../shared/ui/form/fields/TextAreaField';
import { RichTextEditor } from '../../../../shared/ui/form/fields/RichTextEditor';
import { NumberField } from '../../../../shared/ui/form/fields/NumberField';
import { SelectField, type SelectOption } from '../../../../shared/ui/form/fields/SelectField';
import { CheckboxField } from '../../../../shared/ui/form/fields/CheckboxField';
import { SwitchField } from '../../../../shared/ui/form/fields/SwitchField';
import { DateTimeField } from '../../../../shared/ui/form/fields/DateTimeField';
import { EntityLookupField } from '../../../../shared/ui/form/fields/EntityLookupField';
import { AttachmentsField } from '../../../../widgets/attachment/ui/AttachmentsField';
import { ServicePath } from '../../../../shared/api/servicePaths';
import { useRouteMode } from '../../../../shared/hooks/useRouteMode';
import { useActivityEntityTypes } from '../../../../shared/lib/activity/ActivityEntityTypesContext';
import { useActivityQuery } from '../../../../entities/activity/api/useActivityQueries';
import {
  useUpsertActivity,
  useDeleteActivity,
} from '../../../../entities/activity/api/useActivityMutations';
import {
  appointmentSchema,
  emailSchema,
  phoneCallSchema,
  taskSchema,
} from '../../../../entities/activity/model/schema';
import {
  ACTIVITY_PRIORITIES,
  ACTIVITY_SLUG_BY_TYPE,
  ACTIVITY_STATUSES,
  ACTIVITY_TYPE_BY_SLUG,
  type ActivityFormValues,
  type ActivityPriority,
  type ActivityStatus,
  type ActivityType,
  type AppointmentFormValues,
  type CallDirection,
  type EmailFormValues,
  type PhoneCallFormValues,
  type TaskFormValues,
} from '../../../../entities/activity/model/types';
import { RoutePaths } from '../../../../app/router/paths';

const ACTIVITY_ATTACHMENT_ACCEPT =
  '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.eml,.msg';

function buildEmptyValues(type: ActivityType): ActivityFormValues {
  const baseShared = {
    id: '',
    subject: '',
    status: 'NotStarted' as ActivityStatus,
    priority: 'Normal' as ActivityPriority,
    startDate: null,
    endDate: null,
    dueDate: null,
    regardingEntity: null,
    owner: null,
    isActive: true,
  };
  switch (type) {
    case 'PhoneCall':
      return {
        ...baseShared,
        activityType: 'PhoneCall',
        caller: null,
        recipient: null,
        direction: 'Outgoing',
        callNotes: null,
        isHtml: true,
        recordingUrl: null,
      };
    case 'Task':
      return {
        ...baseShared,
        activityType: 'Task',
        taskDescription: null,
        isHtml: true,
        percentComplete: 0,
        reminderAt: null,
      };
    case 'Appointment':
      return {
        ...baseShared,
        activityType: 'Appointment',
        organizer: null,
        attendees: [],
        location: null,
        isOnline: false,
        meetingUrl: null,
        startTime: '',
        endTime: '',
        isAllDay: false,
        reminderMinutesBefore: null,
        reminderSet: null,
        recurrenceRule: null,
        isRecurring: false,
        recurringParentId: null,
        meetingNotes: null,
        isHtml: true,
      };
    case 'Email':
      return {
        ...baseShared,
        activityType: 'Email',
        from: null,
        to: [],
        cc: null,
        bcc: null,
        body: '',
        isHtml: true,
        isSent: false,
        isRead: false,
        readDate: null,
      };
  }
}

export function ActivityDetailPage() {
  const params = useParams<{ type?: string; id?: string }>();
  const { mode, id } = useRouteMode();
  const { t: tPage } = useTranslation('page.activities-detail');
  const { t: tEntity } = useTranslation('entity.activity');
  const { t: tEnums } = useTranslation('enums');
  const { t: tCommon } = useTranslation('common');

  const activityType = params.type ? ACTIVITY_TYPE_BY_SLUG[params.type] : undefined;

  const query = useActivityQuery(activityType, id);
  const upsert = useUpsertActivity();
  const deleteMutation = useDeleteActivity();

  const title = useMemo(() => {
    if (!activityType) return tPage('viewTitle');
    if (mode === 'new') return tPage(`newTitle.${activityType}`);
    if (mode === 'edit') return tPage('editTitle');
    return query.data?.subject ?? tPage('viewTitle');
  }, [activityType, mode, query.data, tPage]);

  if (!activityType) {
    return <Alert type="error" message={tPage('viewTitle')} />;
  }

  const statusOptions: SelectOption<ActivityStatus>[] = ACTIVITY_STATUSES.map((value) => ({
    value,
    label: tEnums(`activityStatus.${value}`),
  }));
  const priorityOptions: SelectOption<ActivityPriority>[] = ACTIVITY_PRIORITIES.map((value) => ({
    value,
    label: tEnums(`activityPriority.${value}`),
  }));

  const empty = buildEmptyValues(activityType);

  // Ekler ayrı bir "Belgeler" sekmesinde (Account detayındaki gibi). Sekme her
  // modda görünür: yeni modda (id yok) AttachmentsField pending dosyaları
  // collector'a register eder, DetailPageLayout submit'te command'a "attachments"
  // olarak enjekte eder; kayıtlı modda mevcut ekleri de listeler.
  const attachmentTabs: DetailPageTab[] = [
    {
      key: 'attachments',
      label: tCommon('tabs.attachments'),
      content: (
        <div style={{ marginBottom: 16 }}>
          <AttachmentsField
            entityType="Activity"
            entityId={id}
            accept={ACTIVITY_ATTACHMENT_ACCEPT}
          />
        </div>
      ),
    },
  ];

  switch (activityType) {
    case 'PhoneCall':
      return (
        <DetailPageLayout<PhoneCallFormValues>
          mode={mode}
          title={title}
          schema={phoneCallSchema}
          defaultValues={empty as PhoneCallFormValues}
          data={query.data as PhoneCallFormValues | undefined}
          isLoading={query.isLoading}
          error={query.isError ? query.error : undefined}
          onSubmit={async (values) => {
            await upsert.mutateAsync(values);
          }}
          onDelete={
            id
              ? async () => {
                  await deleteMutation.mutateAsync([id]);
                }
              : undefined
          }
          afterSaveNavigation={(saved) =>
            RoutePaths.ActivityView(ACTIVITY_SLUG_BY_TYPE.PhoneCall, saved.id)
          }
          tabs={attachmentTabs}
        >
          <GeneralSection statusOptions={statusOptions} priorityOptions={priorityOptions} />
          <PhoneCallSection />
        </DetailPageLayout>
      );

    case 'Task':
      return (
        <DetailPageLayout<TaskFormValues>
          mode={mode}
          title={title}
          schema={taskSchema}
          defaultValues={empty as TaskFormValues}
          data={query.data as TaskFormValues | undefined}
          isLoading={query.isLoading}
          error={query.isError ? query.error : undefined}
          onSubmit={async (values) => {
            await upsert.mutateAsync(values);
          }}
          onDelete={
            id
              ? async () => {
                  await deleteMutation.mutateAsync([id]);
                }
              : undefined
          }
          afterSaveNavigation={(saved) =>
            RoutePaths.ActivityView(ACTIVITY_SLUG_BY_TYPE.Task, saved.id)
          }
          tabs={attachmentTabs}
        >
          <GeneralSection statusOptions={statusOptions} priorityOptions={priorityOptions} />
          <TaskSection />
        </DetailPageLayout>
      );

    case 'Appointment':
      return (
        <DetailPageLayout<AppointmentFormValues>
          mode={mode}
          title={title}
          schema={appointmentSchema}
          defaultValues={empty as AppointmentFormValues}
          data={query.data as AppointmentFormValues | undefined}
          isLoading={query.isLoading}
          error={query.isError ? query.error : undefined}
          onSubmit={async (values) => {
            await upsert.mutateAsync(values);
          }}
          onDelete={
            id
              ? async () => {
                  await deleteMutation.mutateAsync([id]);
                }
              : undefined
          }
          afterSaveNavigation={(saved) =>
            RoutePaths.ActivityView(ACTIVITY_SLUG_BY_TYPE.Appointment, saved.id)
          }
          tabs={attachmentTabs}
        >
          <GeneralSection statusOptions={statusOptions} priorityOptions={priorityOptions} />
          <AppointmentSection />
        </DetailPageLayout>
      );

    case 'Email':
      return (
        <DetailPageLayout<EmailFormValues>
          mode={mode}
          title={title}
          schema={emailSchema}
          defaultValues={empty as EmailFormValues}
          data={query.data as EmailFormValues | undefined}
          isLoading={query.isLoading}
          error={query.isError ? query.error : undefined}
          onSubmit={async (values) => {
            await upsert.mutateAsync(values);
          }}
          onDelete={
            id
              ? async () => {
                  await deleteMutation.mutateAsync([id]);
                }
              : undefined
          }
          afterSaveNavigation={(saved) =>
            RoutePaths.ActivityView(ACTIVITY_SLUG_BY_TYPE.Email, saved.id)
          }
          tabs={attachmentTabs}
        >
          <GeneralSection statusOptions={statusOptions} priorityOptions={priorityOptions} />
          <EmailSection />
        </DetailPageLayout>
      );
  }

  function GeneralSection({
    statusOptions,
    priorityOptions,
  }: {
    statusOptions: SelectOption<ActivityStatus>[];
    priorityOptions: SelectOption<ActivityPriority>[];
  }) {
    const form = useFormContext<ActivityFormValues>();
    const control = form.control as unknown as Control<ActivityFormValues>;
    const { regardingEntityTypes } = useActivityEntityTypes();
    return (
      <FormSection title={tEntity('sections.general')} collapsible="expanded">
        <TextField
          name="subject"
          control={control}
          label={tEntity('fields.subject.label')}
          placeholder={tEntity('fields.subject.placeholder')}
          required
          maxLength={500}
        />
        <FormRow>
          <SelectField<ActivityFormValues, ActivityStatus>
            name="status"
            control={control}
            label={tEntity('fields.status.label')}
            options={statusOptions}
            required
          />
          <SelectField<ActivityFormValues, ActivityPriority>
            name="priority"
            control={control}
            label={tEntity('fields.priority.label')}
            options={priorityOptions}
            required
          />
        </FormRow>
        <FormRow>
          <DateTimeField
            name="dueDate"
            control={control}
            label={tEntity('fields.dueDate.label')}
          />
          <EntityLookupField
            name="owner"
            control={control}
            servicePath={ServicePath.User.Search}
            entityType="User"
            label={tEntity('fields.owner.label')}
            modalTitle={tEntity('owner.modalTitle')}
          />
        </FormRow>
        <EntityLookupField
          name="regardingEntity"
          control={control}
          entityTypes={regardingEntityTypes}
          label={tEntity('fields.regardingEntity.label')}
          modalTitle={tEntity('regarding.modalTitle')}
        />
      </FormSection>
    );
  }

  // İçerik bölümü: not/açıklama alanı `isHtml` bayrağına göre zengin metin
  // (RichTextEditor) veya düz metin (TextAreaField) ile beslenir. `isHtml`
  // toggle'ı bölüm başlığının sağında (FormSection `extra`) durur. Her aktivite
  // türünün kendi içerik alanı farklı isimde olduğu için tür-spesifik form
  // değerleri üzerinden generic çalışır (`control` çağırandan geçer).
  function ContentSection<TValues extends FieldValues>({
    control,
    name,
    rows = 8,
  }: {
    control: Control<TValues>;
    name: FieldPath<TValues>;
    rows?: number;
  }) {
    const isHtmlName = 'isHtml' as FieldPath<TValues>;
    const isHtml = useWatch({ control, name: isHtmlName });
    return (
      <FormSection
        title={tEntity('sections.content')}
        collapsible="expanded"
        extra={
          <SwitchField
            name={isHtmlName}
            control={control}
            style={{ marginBottom: 0 }}
          />
        }
      >
        {isHtml ? (
          <RichTextEditor name={name} control={control} minHeight={200} />
        ) : (
          <TextAreaField name={name} control={control} rows={rows} />
        )}
      </FormSection>
    );
  }

  function PhoneCallSection() {
    const form = useFormContext<PhoneCallFormValues>();
    const { partyEntityTypes } = useActivityEntityTypes();
    const directionOptions: SelectOption<CallDirection>[] = [
      { value: 'Incoming', label: tEnums('direction.Incoming', { defaultValue: 'Gelen' }) },
      { value: 'Outgoing', label: tEnums('direction.Outgoing', { defaultValue: 'Giden' }) },
    ];
    return (
      <>
      <FormSection title={tEntity('sections.phoneCall')} collapsible="expanded">
        <FormRow>
          <EntityLookupField
            name="caller"
            control={form.control}
            entityTypes={partyEntityTypes}
            label={tEntity('fields.caller.label')}
            modalTitle={tEntity('callPerson.modalTitle')}
          />
          <EntityLookupField
            name="recipient"
            control={form.control}
            entityTypes={partyEntityTypes}
            label={tEntity('fields.recipient.label')}
            modalTitle={tEntity('callPerson.modalTitle')}
          />
        </FormRow>
        <SelectField<PhoneCallFormValues, CallDirection>
          name="direction"
          control={form.control}
          label={tEntity('fields.direction.label')}
          options={directionOptions}
          required
        />
        <TextField
          name="recordingUrl"
          control={form.control}
          label={tEntity('fields.recordingUrl.label')}
          placeholder="https://..."
        />
      </FormSection>
      <ContentSection control={form.control} name="callNotes" rows={4} />
      </>
    );
  }

  function TaskSection() {
    const form = useFormContext<TaskFormValues>();
    return (
      <>
      <FormSection title={tEntity('sections.task')} collapsible="expanded">
        <FormRow>
          <NumberField
            name="percentComplete"
            control={form.control}
            label={tEntity('fields.percentComplete.label')}
            min={0}
            max={100}
            step={5}
          />
          <DateTimeField
            name="reminderAt"
            control={form.control}
            label={tEntity('fields.reminderAt.label')}
            showTime
          />
        </FormRow>
      </FormSection>
      <ContentSection control={form.control} name="taskDescription" rows={4} />
      </>
    );
  }

  function AppointmentSection() {
    const form = useFormContext<AppointmentFormValues>();
    const { partyEntityTypes } = useActivityEntityTypes();
    return (
      <>
      <FormSection title={tEntity('sections.appointment')} collapsible="expanded">
        <FormRow>
          <DateTimeField
            name="startTime"
            control={form.control}
            label={tEntity('fields.startTime.label')}
            showTime
            required
          />
          <DateTimeField
            name="endTime"
            control={form.control}
            label={tEntity('fields.endTime.label')}
            showTime
            required
          />
        </FormRow>
        <FormRow>
          <CheckboxField
            name="isAllDay"
            control={form.control}
            label={tEntity('fields.isAllDay.label')}
          />
          <CheckboxField
            name="isOnline"
            control={form.control}
            label={tEntity('fields.isOnline.label')}
          />
          <CheckboxField
            name="isRecurring"
            control={form.control}
            label={tEntity('fields.isRecurring.label')}
          />
        </FormRow>
        <FormRow>
          <TextField
            name="location"
            control={form.control}
            label={tEntity('fields.location.label')}
          />
          <TextField
            name="meetingUrl"
            control={form.control}
            label={tEntity('fields.meetingUrl.label')}
            placeholder="https://..."
          />
        </FormRow>
        <EntityLookupField
          name="organizer"
          control={form.control}
          servicePath={ServicePath.User.Search}
          entityType="User"
          label={tEntity('fields.organizer.label')}
          modalTitle={tEntity('owner.modalTitle')}
        />
        <EntityLookupField
          name="attendees"
          control={form.control}
          entityTypes={partyEntityTypes}
          multiple
          label={tEntity('fields.attendees.label', { defaultValue: 'Katılımcılar' })}
          modalTitle={tEntity('attendees.modalTitle', { defaultValue: 'Katılımcılar' })}
        />
        <NumberField
          name="reminderMinutesBefore"
          control={form.control}
          label={tEntity('fields.reminderMinutesBefore.label')}
          min={0}
          step={5}
        />
      </FormSection>
      <ContentSection control={form.control} name="meetingNotes" rows={4} />
      </>
    );
  }

  function EmailSection() {
    const form = useFormContext<EmailFormValues>();
    const { partyEntityTypes } = useActivityEntityTypes();
    return (
      <>
      <FormSection title={tEntity('sections.email')} collapsible="expanded">
        <EntityLookupField
          name="from"
          control={form.control}
          entityTypes={partyEntityTypes}
          label={tEntity('fields.from.label')}
          modalTitle={tEntity('emailContacts.modalTitle')}
        />
        <EntityLookupField
          name="to"
          control={form.control}
          entityTypes={partyEntityTypes}
          multiple
          label={tEntity('fields.to.label', { defaultValue: 'Alıcılar' })}
          modalTitle={tEntity('emailContacts.modalTitle')}
        />
        <EntityLookupField
          name="cc"
          control={form.control}
          entityTypes={partyEntityTypes}
          multiple
          label={tEntity('fields.cc.label', { defaultValue: 'CC' })}
          modalTitle={tEntity('emailContacts.modalTitle')}
        />
        <EntityLookupField
          name="bcc"
          control={form.control}
          entityTypes={partyEntityTypes}
          multiple
          label={tEntity('fields.bcc.label', { defaultValue: 'BCC' })}
          modalTitle={tEntity('emailContacts.modalTitle')}
        />
      </FormSection>
      <ContentSection control={form.control} name="body" rows={8} />
      </>
    );
  }
}

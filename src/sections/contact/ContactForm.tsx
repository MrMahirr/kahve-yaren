import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { IconAlert, IconArrowRight } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import {
  MESSAGE_MAX,
  contactSchema,
  errorSummary,
  topicMessage,
  type ContactValues,
} from '@/features/contact/contactSchema'
import { cn } from '@/lib/cn'
import { errorId, fieldControlClasses } from './fieldClasses'
import { FormField } from './FormField'
import { TopicChip } from './TopicChip'

/** Alan kimlikleri orijinal tasarımla aynı (Türkçe); hata öğeleri `${id}-hata` olur. */
const FIELD_IDS: Record<keyof ContactValues, string> = {
  name: 'ad',
  email: 'eposta',
  message: 'mesaj',
}

type ContactFormProps = {
  topic: string
  onClearTopic: () => void
  onSubmit: (values: ContactValues) => void
  /** "Yeni mesaj yaz" ile dönüldüğünde ad alanına odaklanılır; ilk yüklemede değil. */
  focusOnMount?: boolean
}

/**
 * İletişim formu. İlk gönderime kadar sessizdir, sonrasında yazdıkça doğrular;
 * hatalıysa ilk hatalı alana odaklanır. Sunucu bağlantısı yoktur.
 */
export function ContactForm({ topic, onClearTopic, onSubmit, focusOnMount }: ContactFormProps) {
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    setFocus,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: { name: '', email: '', message: '' },
  })

  // Menüden konu gelince boş mesaj alanı şablonla dolar; yazılmış mesaja dokunulmaz.
  useEffect(() => {
    if (topic && !getValues('message').trim()) setValue('message', topicMessage(topic))
  }, [topic, getValues, setValue])

  useEffect(() => {
    if (focusOnMount) setFocus('name')
  }, [focusOnMount, setFocus])

  const errorCount = Object.keys(errors).length
  const messageLength = useWatch({ control, name: 'message' }).length

  const controlProps = (field: keyof ContactValues) => ({
    id: FIELD_IDS[field],
    'aria-invalid': Boolean(errors[field]),
    'aria-describedby': errorId(FIELD_IDS[field]),
    ...register(field),
  })

  return (
    <form
      noValidate
      aria-label="İletişim formu"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-7"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h3 className="m-0 font-display text-[28px] leading-[1.1] font-semibold tracking-[-.02em]">
          Mesaj bırak
        </h3>
        <span className="text-sm text-dem">Tüm alanlar zorunludur.</span>
      </div>

      {topic && <TopicChip topic={topic} onClear={onClearTopic} />}

      {errorCount > 0 && (
        <div
          role="alert"
          className="flex animate-pop items-center gap-3 rounded-[2px] bg-kiremit-acik px-4 py-3.5 text-[15px] font-semibold text-kiremit"
        >
          <IconAlert className="flex-none" />
          <span>{errorSummary(errorCount)}</span>
        </div>
      )}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-x-6 gap-y-7">
        <FormField id={FIELD_IDS.name} label="Adınız" error={errors.name?.message}>
          <input
            type="text"
            autoComplete="name"
            placeholder="Ayşe Yılmaz"
            className={cn(fieldControlClasses, 'h-[52px]')}
            {...controlProps('name')}
          />
        </FormField>
        <FormField id={FIELD_IDS.email} label="E-posta" error={errors.email?.message}>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="ad@alanadi.com"
            className={cn(fieldControlClasses, 'h-[52px]')}
            {...controlProps('email')}
          />
        </FormField>
      </div>

      <FormField
        id={FIELD_IDS.message}
        label="Mesajınız"
        error={errors.message?.message}
        aside={
          <span aria-hidden="true" className="font-mono text-xs leading-[normal] text-dem">
            {messageLength} / {MESSAGE_MAX}
          </span>
        }
      >
        <textarea
          rows={4}
          maxLength={MESSAGE_MAX}
          placeholder="Bir soru, bir öneri ya da sadece bir merhaba…"
          className={cn(fieldControlClasses, 'min-h-[120px] resize-y py-3')}
          {...controlProps('message')}
        />
      </FormField>

      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <Button type="submit" className="w-full sm:w-auto">
          Mesajı Gönder
          <IconArrowRight />
        </Button>
        <span className="w-full text-center text-sm text-dem sm:w-auto sm:text-left">
          Yanıtı e-posta adresine göndeririz.
        </span>
      </div>
    </form>
  )
}

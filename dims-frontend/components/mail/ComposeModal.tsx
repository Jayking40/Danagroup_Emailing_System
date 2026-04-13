"use client";

import { useState, useEffect } from "react";
import { X, Minimize2, Maximize2, Send, Paperclip, Loader2, Trash2 } from "lucide-react";
import { useMailStore } from "@/store/mailStore";
import toast from 'react-hot-toast';
import { useMail } from '@/hooks/useMail'; // Adjust path to where your useMail hook lives
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Input, { ComposeInput } from "../ui/Input";

// TODO: Implement ComposeModal Component
// - Floating compose modal (Gmail-style, bottom-right)
// - Controlled via mailStore (isComposeOpen, composeDefaults, closeCompose)
// - Fields: To (RecipientInput), CC, BCC, Subject, Body (rich text), Attachments
// - Rich text editor: TipTap or Quill
// - Save as Draft: POST /api/mail/draft
// - Send: POST /api/mail/send
// - Attachment uploader: AttachmentUploader component
// - Reply mode: pre-fills threadId, recipient, subject with "Re:"
// - Forward mode: pre-fills subject with "Fwd:", body with original message


interface ComposeFormInput {
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  body: string;
}

// Helper to validate comma-separated emails
const emailList = z.string()
  .transform((val) => val.split(',').map(e => e.trim()).filter(Boolean))
  .pipe(z.array(z.string().email("Invalid format"))
);

const composeSchema = z.object({
  to: emailList,
  // If empty, transform to empty string first, then to empty array
  cc: z.string().optional().default("").transform(v => v.split(',').map(e => e.trim()).filter(Boolean)),
  bcc: z.string().optional().default("").transform(v => v.split(',').map(e => e.trim()).filter(Boolean)),
  subject: z.string().min(1, "Required"),
  body: z.string().min(1, "Required"),
});



type ComposeFormValues = z.infer<typeof composeSchema>;

export default function ComposeModal() {
  const { isComposeOpen, closeCompose } = useMailStore();
  const { useSendMail } = useMail();
  const { mutate: sendEmail, isPending } = useSendMail();
  const [isMaximized, setIsMaximized] = useState(false);

  // Initialize Hook Form
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ComposeFormInput>({
    resolver: zodResolver(composeSchema),
    defaultValues: { to: '', cc: '', bcc: '', subject: '', body: '' }
  });

  // Transformation Logic
  // Change 'data: ComposeFormValues' to 'data: any'
  const onSubmit = (data: any) => {
    // At this point, Zod has already transformed strings to arrays
    const validatedData = data as ComposeFormValues; 

    const recipientList = [
      ...validatedData.to.map(email => ({ email, type: 'to' as const })),
      ...(validatedData.cc || []).map(email => ({ email, type: 'cc' as const })),
      ...(validatedData.bcc || []).map(email => ({ email, type: 'bcc' as const })),
    ];

    sendEmail({
      recipients: recipientList,
      subject: validatedData.subject,
      body: validatedData.body,
      bodyHtml: `<p>${validatedData.body.replace(/\n/g, '<br>')}</p>`,
      isDraft: false,
    }, {
      onSuccess: () => {
        toast.success('Message sent!');
        reset();
        closeCompose();
      },
      onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to send'),
    });
  };



  if (!isComposeOpen) return null;

  return (
    <div className="relative">
     {/* Backdrop Overlay */}
      <div 
        className="fixed inset-0 z-[90] bg-black/20 backdrop-blur-[3px] transition-opacity"
        onClick={closeCompose} // Optional: closes when clicking outside
      />
      
      <div className=" flex justify-center items-center fixed top-0 h-screen w-screen z-[100] ">
        {/* Header same as before */}
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col py-16 z-[100] bg-dana-red-200/90 maxh-[70vh] max-w-[60vw] rounded-lg">
          <div className="px-4 gap-4 flex flex-col">
            <ComposeInput
              register = {register("to")}
              type="text"
              label="to"
              placeholder="To (comma separated)"
              errors={errors.to}
            />

            <ComposeInput
              type="text"
              register = {register("cc")}
              placeholder="CC"
              label="cc"
              errors={errors.cc}

            />

            <ComposeInput
              type="text"
              label="bcc"
              register = {register("bcc")}
              placeholder="BCC"
              errors={errors.bcc}

            />
            

            <ComposeInput
              type="text"
              label="subject"
              register = {register("subject")}
              placeholder="Subject"
              errors={errors.subject}
            />

            <textarea
              {...register("body")}
              placeholder="Write your message..."
              className="w-full flex-1 resize-none p-4 text-sm text-gray-700 outline-none"
            />
              
          </div>
          

          {/* Footer with Submit Button */}
          <button type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin" /> : <Send />} Send
          </button>
        </form>
      </div>
    </div>
  );
}

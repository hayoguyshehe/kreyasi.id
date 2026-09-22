import { create } from "zustand";
import type { InvitationContent } from "@/types";
import type { EditorStepId } from "@/lib/constants";

// ============================================
// Zustand Store — Editor Undangan Multi-Step
// ============================================

interface EditorState {
  /** Step yang sedang aktif */
  currentStep: EditorStepId;

  /** ID undangan yang sedang diedit */
  invitationId: string | null;

  /** Data konten undangan */
  content: Partial<InvitationContent>;

  /** Metadata undangan */
  eventTitle: string;
  eventDate: string;
  eventCategory: string;

  /** Apakah ada perubahan yang belum disimpan */
  isDirty: boolean;

  /** Apakah sedang menyimpan */
  isSaving: boolean;

  /** Actions */
  setStep: (step: EditorStepId) => void;
  setInvitationId: (id: string) => void;
  setEventTitle: (title: string) => void;
  setEventDate: (date: string) => void;
  setEventCategory: (category: string) => void;
  updateContent: (partial: Partial<InvitationContent>) => void;
  setIsDirty: (dirty: boolean) => void;
  setIsSaving: (saving: boolean) => void;
  resetEditor: () => void;
  loadInvitation: (data: {
    id: string;
    eventTitle: string;
    eventDate: string;
    eventCategory: string;
    content: InvitationContent;
  }) => void;
}

const initialContent: Partial<InvitationContent> = {
  coverTitle: "",
  events: [],
  gallery: [],
  theme: {
    primaryColor: "#D4A373",
    fontFamily: "Plus Jakarta Sans",
  },
};

export const useEditorStore = create<EditorState>((set) => ({
  currentStep: "info",
  invitationId: null,
  content: { ...initialContent },
  eventTitle: "",
  eventDate: "",
  eventCategory: "",
  isDirty: false,
  isSaving: false,

  setStep: (step) => set({ currentStep: step }),

  setInvitationId: (id) => set({ invitationId: id }),

  setEventTitle: (title) => set({ eventTitle: title, isDirty: true }),

  setEventDate: (date) => set({ eventDate: date, isDirty: true }),

  setEventCategory: (category) => set({ eventCategory: category, isDirty: true }),

  updateContent: (partial) =>
    set((state) => ({
      content: { ...state.content, ...partial },
      isDirty: true,
    })),

  setIsDirty: (dirty) => set({ isDirty: dirty }),

  setIsSaving: (saving) => set({ isSaving: saving }),

  resetEditor: () =>
    set({
      currentStep: "info",
      invitationId: null,
      content: { ...initialContent },
      eventTitle: "",
      eventDate: "",
      eventCategory: "",
      isDirty: false,
      isSaving: false,
    }),

  loadInvitation: (data) =>
    set({
      invitationId: data.id,
      eventTitle: data.eventTitle,
      eventDate: data.eventDate,
      eventCategory: data.eventCategory,
      content: data.content,
      isDirty: false,
      isSaving: false,
    }),
}));

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      applicants: {
        Row: {
          arabic_level: string | null
          archived_at: string | null
          available_date: string | null
          birth_date: string | null
          created_at: string
          current_city: string | null
          current_salary: string | null
          current_study: string | null
          current_tasks: string | null
          current_title: string | null
          currently_employed: string | null
          currently_studying: string | null
          degree_url: string | null
          dependents: number | null
          desired_position: string | null
          education_level: string | null
          email: string | null
          english_level: string | null
          expected_salary: string | null
          experience_cert_url: string | null
          facility_management_exp: string | null
          full_name: string
          gender: string | null
          gpa: string | null
          graduation_year: string | null
          has_transport: string | null
          hear_about: string | null
          id: string
          is_archived: boolean
          job_type: string | null
          linkedin: string | null
          major: string | null
          marital_status: string | null
          nationality: string | null
          notes: string | null
          other_docs_url: string | null
          other_experience: string | null
          other_language: string | null
          phone: string | null
          preferred_city: string | null
          resume_url: string | null
          self_summary: string | null
          status: Database["public"]["Enums"]["applicant_status"]
          training_certs_url: string | null
          university: string | null
          updated_at: string
          years_experience: string | null
        }
        Insert: {
          arabic_level?: string | null
          archived_at?: string | null
          available_date?: string | null
          birth_date?: string | null
          created_at?: string
          current_city?: string | null
          current_salary?: string | null
          current_study?: string | null
          current_tasks?: string | null
          current_title?: string | null
          currently_employed?: string | null
          currently_studying?: string | null
          degree_url?: string | null
          dependents?: number | null
          desired_position?: string | null
          education_level?: string | null
          email?: string | null
          english_level?: string | null
          expected_salary?: string | null
          experience_cert_url?: string | null
          facility_management_exp?: string | null
          full_name: string
          gender?: string | null
          gpa?: string | null
          graduation_year?: string | null
          has_transport?: string | null
          hear_about?: string | null
          id?: string
          is_archived?: boolean
          job_type?: string | null
          linkedin?: string | null
          major?: string | null
          marital_status?: string | null
          nationality?: string | null
          notes?: string | null
          other_docs_url?: string | null
          other_experience?: string | null
          other_language?: string | null
          phone?: string | null
          preferred_city?: string | null
          resume_url?: string | null
          self_summary?: string | null
          status?: Database["public"]["Enums"]["applicant_status"]
          training_certs_url?: string | null
          university?: string | null
          updated_at?: string
          years_experience?: string | null
        }
        Update: {
          arabic_level?: string | null
          archived_at?: string | null
          available_date?: string | null
          birth_date?: string | null
          created_at?: string
          current_city?: string | null
          current_salary?: string | null
          current_study?: string | null
          current_tasks?: string | null
          current_title?: string | null
          currently_employed?: string | null
          currently_studying?: string | null
          degree_url?: string | null
          dependents?: number | null
          desired_position?: string | null
          education_level?: string | null
          email?: string | null
          english_level?: string | null
          expected_salary?: string | null
          experience_cert_url?: string | null
          facility_management_exp?: string | null
          full_name?: string
          gender?: string | null
          gpa?: string | null
          graduation_year?: string | null
          has_transport?: string | null
          hear_about?: string | null
          id?: string
          is_archived?: boolean
          job_type?: string | null
          linkedin?: string | null
          major?: string | null
          marital_status?: string | null
          nationality?: string | null
          notes?: string | null
          other_docs_url?: string | null
          other_experience?: string | null
          other_language?: string | null
          phone?: string | null
          preferred_city?: string | null
          resume_url?: string | null
          self_summary?: string | null
          status?: Database["public"]["Enums"]["applicant_status"]
          training_certs_url?: string | null
          university?: string | null
          updated_at?: string
          years_experience?: string | null
        }
        Relationships: []
      }
      custom_answers: {
        Row: {
          answer: string | null
          applicant_id: string
          created_at: string
          id: string
          question_id: string
        }
        Insert: {
          answer?: string | null
          applicant_id: string
          created_at?: string
          id?: string
          question_id: string
        }
        Update: {
          answer?: string | null
          applicant_id?: string
          created_at?: string
          id?: string
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_answers_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "applicants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custom_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "custom_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_questions: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          is_required: boolean
          options_ar: string[] | null
          options_en: string[] | null
          question_ar: string
          question_en: string | null
          sort_order: number
          step_number: number
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          is_required?: boolean
          options_ar?: string[] | null
          options_en?: string[] | null
          question_ar: string
          question_en?: string | null
          sort_order?: number
          step_number?: number
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          is_required?: boolean
          options_ar?: string[] | null
          options_en?: string[] | null
          question_ar?: string
          question_en?: string | null
          sort_order?: number
          step_number?: number
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      dropdown_options: {
        Row: {
          created_at: string
          field_name: string
          id: string
          is_active: boolean
          options_ar: string[]
          options_en: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          field_name: string
          id?: string
          is_active?: boolean
          options_ar?: string[]
          options_en?: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          field_name?: string
          id?: string
          is_active?: boolean
          options_ar?: string[]
          options_en?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      form_field_config: {
        Row: {
          created_at: string
          field_name: string
          id: string
          is_required: boolean
          is_visible: boolean
          label_ar: string | null
          label_en: string | null
          sort_order: number
          step_number: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          field_name: string
          id?: string
          is_required?: boolean
          is_visible?: boolean
          label_ar?: string | null
          label_en?: string | null
          sort_order?: number
          step_number?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          field_name?: string
          id?: string
          is_required?: boolean
          is_visible?: boolean
          label_ar?: string | null
          label_en?: string | null
          sort_order?: number
          step_number?: number
          updated_at?: string
        }
        Relationships: []
      }
      job_postings: {
        Row: {
          additional_details_ar: string | null
          additional_details_en: string | null
          created_at: string
          degree_required_ar: string | null
          degree_required_en: string | null
          department: string | null
          department_en: string | null
          description_ar: string | null
          description_en: string | null
          experience_required_ar: string | null
          experience_required_en: string | null
          id: string
          is_active: boolean
          job_type: string
          job_type_en: string | null
          location: string
          location_en: string | null
          nationality_required: string | null
          nationality_required_en: string | null
          project_id: string | null
          requirements_ar: string | null
          requirements_en: string | null
          salary_range: string | null
          title_ar: string
          title_en: string | null
          updated_at: string
          vacancy_count: number
        }
        Insert: {
          additional_details_ar?: string | null
          additional_details_en?: string | null
          created_at?: string
          degree_required_ar?: string | null
          degree_required_en?: string | null
          department?: string | null
          department_en?: string | null
          description_ar?: string | null
          description_en?: string | null
          experience_required_ar?: string | null
          experience_required_en?: string | null
          id?: string
          is_active?: boolean
          job_type: string
          job_type_en?: string | null
          location: string
          location_en?: string | null
          nationality_required?: string | null
          nationality_required_en?: string | null
          project_id?: string | null
          requirements_ar?: string | null
          requirements_en?: string | null
          salary_range?: string | null
          title_ar: string
          title_en?: string | null
          updated_at?: string
          vacancy_count?: number
        }
        Update: {
          additional_details_ar?: string | null
          additional_details_en?: string | null
          created_at?: string
          degree_required_ar?: string | null
          degree_required_en?: string | null
          department?: string | null
          department_en?: string | null
          description_ar?: string | null
          description_en?: string | null
          experience_required_ar?: string | null
          experience_required_en?: string | null
          id?: string
          is_active?: boolean
          job_type?: string
          job_type_en?: string | null
          location?: string
          location_en?: string | null
          nationality_required?: string | null
          nationality_required_en?: string | null
          project_id?: string | null
          requirements_ar?: string | null
          requirements_en?: string | null
          salary_range?: string | null
          title_ar?: string
          title_en?: string | null
          updated_at?: string
          vacancy_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "job_postings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          is_active: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description_ar: string | null
          description_en: string | null
          id: string
          is_active: boolean
          logo_url: string | null
          name_ar: string
          name_en: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name_ar: string
          name_en?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name_ar?: string
          name_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          accent_color: string | null
          created_at: string
          cta_desc_ar: string | null
          cta_desc_en: string | null
          cta_title_ar: string | null
          cta_title_en: string | null
          employee_count: string | null
          feature1_desc_ar: string | null
          feature1_desc_en: string | null
          feature1_title_ar: string | null
          feature1_title_en: string | null
          feature2_desc_ar: string | null
          feature2_desc_en: string | null
          feature2_title_ar: string | null
          feature2_title_en: string | null
          feature3_desc_ar: string | null
          feature3_desc_en: string | null
          feature3_title_ar: string | null
          feature3_title_en: string | null
          founding_year: string | null
          hero_desc_ar: string | null
          hero_desc_en: string | null
          hero_title1_ar: string | null
          hero_title1_en: string | null
          hero_title2_ar: string | null
          hero_title2_en: string | null
          id: string
          logo_url: string | null
          primary_color: string | null
          projects_count: string | null
          show_projects_section: boolean | null
          show_stats_section: boolean | null
          site_name_ar: string | null
          site_name_en: string | null
          stats_section_title_ar: string | null
          stats_section_title_en: string | null
          updated_at: string
        }
        Insert: {
          accent_color?: string | null
          created_at?: string
          cta_desc_ar?: string | null
          cta_desc_en?: string | null
          cta_title_ar?: string | null
          cta_title_en?: string | null
          employee_count?: string | null
          feature1_desc_ar?: string | null
          feature1_desc_en?: string | null
          feature1_title_ar?: string | null
          feature1_title_en?: string | null
          feature2_desc_ar?: string | null
          feature2_desc_en?: string | null
          feature2_title_ar?: string | null
          feature2_title_en?: string | null
          feature3_desc_ar?: string | null
          feature3_desc_en?: string | null
          feature3_title_ar?: string | null
          feature3_title_en?: string | null
          founding_year?: string | null
          hero_desc_ar?: string | null
          hero_desc_en?: string | null
          hero_title1_ar?: string | null
          hero_title1_en?: string | null
          hero_title2_ar?: string | null
          hero_title2_en?: string | null
          id?: string
          logo_url?: string | null
          primary_color?: string | null
          projects_count?: string | null
          show_projects_section?: boolean | null
          show_stats_section?: boolean | null
          site_name_ar?: string | null
          site_name_en?: string | null
          stats_section_title_ar?: string | null
          stats_section_title_en?: string | null
          updated_at?: string
        }
        Update: {
          accent_color?: string | null
          created_at?: string
          cta_desc_ar?: string | null
          cta_desc_en?: string | null
          cta_title_ar?: string | null
          cta_title_en?: string | null
          employee_count?: string | null
          feature1_desc_ar?: string | null
          feature1_desc_en?: string | null
          feature1_title_ar?: string | null
          feature1_title_en?: string | null
          feature2_desc_ar?: string | null
          feature2_desc_en?: string | null
          feature2_title_ar?: string | null
          feature2_title_en?: string | null
          feature3_desc_ar?: string | null
          feature3_desc_en?: string | null
          feature3_title_ar?: string | null
          feature3_title_en?: string | null
          founding_year?: string | null
          hero_desc_ar?: string | null
          hero_desc_en?: string | null
          hero_title1_ar?: string | null
          hero_title1_en?: string | null
          hero_title2_ar?: string | null
          hero_title2_en?: string | null
          id?: string
          logo_url?: string | null
          primary_color?: string | null
          projects_count?: string | null
          show_projects_section?: boolean | null
          show_stats_section?: boolean | null
          site_name_ar?: string | null
          site_name_en?: string | null
          stats_section_title_ar?: string | null
          stats_section_title_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_or_hr: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "admin"
        | "hr_manager"
        | "recruitment_coordinator"
        | "project_manager"
      applicant_status:
        | "new"
        | "reviewing"
        | "phone_interview"
        | "in_person_interview"
        | "accepted"
        | "hired"
        | "rejected"
        | "withdrawn"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "hr_manager",
        "recruitment_coordinator",
        "project_manager",
      ],
      applicant_status: [
        "new",
        "reviewing",
        "phone_interview",
        "in_person_interview",
        "accepted",
        "hired",
        "rejected",
        "withdrawn",
      ],
    },
  },
} as const

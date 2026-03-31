import FormField from "../FormField";

interface Props {
  data: Record<string, string>;
  onChange: (name: string, value: string) => void;
  onFileChange: (name: string, file: File | null) => void;
}

const AttachmentsStep = ({ data, onChange, onFileChange }: Props) => {
  return (
    <div className="space-y-5 animate-fade-in">
      <h3 className="text-xl font-bold text-primary mb-6">المرفقات</h3>
      <div className="grid grid-cols-1 gap-5">
        <FormField
          label="تحميل السيرة الذاتية"
          name="resume"
          type="file"
          required
          value=""
          onChange={onChange}
          onFileChange={onFileChange}
          accept=".pdf,.doc,.docx"
        />
        <FormField
          label="صورة من المؤهل العلمي"
          name="degreeCopy"
          type="file"
          value=""
          onChange={onChange}
          onFileChange={onFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
        />
        <FormField
          label="شهادة الخبرة (إن وجدت)"
          name="experienceCert"
          type="file"
          value=""
          onChange={onChange}
          onFileChange={onFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
        />
        <FormField
          label="مستندات الدورات التدريبية"
          name="trainingCerts"
          type="file"
          value=""
          onChange={onChange}
          onFileChange={onFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
        />
        <FormField
          label="مستندات أخرى ترغب بإضافتها"
          name="otherDocs"
          type="file"
          value=""
          onChange={onChange}
          onFileChange={onFileChange}
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        />
      </div>
    </div>
  );
};

export default AttachmentsStep;

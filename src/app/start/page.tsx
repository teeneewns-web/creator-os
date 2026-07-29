"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  ContentCapability,
  ContentGoal,
  ContentPlatform,
  DailyTime,
  PlanRequest,
} from "../../types/plan-request";


type FormErrors = Partial<Record<keyof PlanRequest, string>>;

const DRAFT_STORAGE_KEY = "creator-os-start-draft-v1";
const REQUEST_STORAGE_KEY = "creator-os-plan-request-v1";

const GOAL_OPTIONS: Array<{
  value: ContentGoal;
  title: string;
  description: string;
}> = [
  {
    value: "sell",
    title: "ขายสินค้า",
    description:
      "สร้างคอนเทนต์ที่ช่วยให้คนเข้าใจสินค้า ลดความลังเล และดูรายละเอียดต่อ",
  },
  {
    value: "grow",
    title: "เพิ่มผู้ติดตาม",
    description:
      "สร้างคอนเทนต์ที่มีประโยชน์และทำให้คนอยากติดตามผลงานต่อ",
  },
  {
    value: "engagement",
    title: "เรียกความคิดเห็นและการมีส่วนร่วม",
    description:
      "ชวนให้ผู้ชมตอบคำถาม แสดงความคิดเห็น บันทึก หรือแชร์",
  },
  {
    value: "trust",
    title: "สร้างความน่าเชื่อถือ",
    description:
      "แสดงข้อมูล ประสบการณ์ หลักฐาน และความโปร่งใสของธุรกิจ",
  },
  {
    value: "promote",
    title: "โปรโมตร้านหรือบริการ",
    description:
      "ทำให้คนรู้จักร้าน บริการ โปรโมชั่น หรือกิจกรรมที่กำลังจัด",
  },
];

const PLATFORM_OPTIONS: Array<{
  value: ContentPlatform;
  title: string;
  description: string;
}> = [
  {
    value: "facebook",
    title: "Facebook",
    description:
      "เหมาะกับโพสต์ภาพ ข้อความ คำถาม Reels และการสนทนาในความคิดเห็น",
  },
  {
    value: "tiktok",
    title: "TikTok",
    description:
      "เหมาะกับคลิปสั้น ประโยคเปิดที่ดึงดูด บทพูด และลำดับการถ่าย",
  },
  {
    value: "facebook-and-tiktok",
    title: "Facebook และ TikTok",
    description:
      "ระบบจะปรับงานหลักให้สามารถนำไปใช้กับทั้งสองแพลตฟอร์ม",
  },
];

const TIME_OPTIONS: Array<{
  value: DailyTime;
  title: string;
  description: string;
}> = [
  {
    value: "10-20",
    title: "10–20 นาทีต่อวัน",
    description:
      "แผนเบา เน้นงานที่ทำได้เร็ว ใช้ภาพหรือข้อความมากขึ้น",
  },
  {
    value: "30-45",
    title: "30–45 นาทีต่อวัน",
    description:
      "แผนมาตรฐาน ผสมคลิป ภาพ และโพสต์ข้อความอย่างเหมาะสม",
  },
  {
    value: "60-90",
    title: "60–90 นาทีต่อวัน",
    description:
      "แผนเต็ม มีคลิปมากขึ้น พร้อมงานเสริมและการติดตามผล",
  },
  {
    value: "90-plus",
    title: "มากกว่า 90 นาทีต่อวัน",
    description:
      "เหมาะกับผู้ที่มีทีม หรือสามารถผลิตคอนเทนต์ได้หลายรูปแบบ",
  },
];

const CAPABILITY_OPTIONS: Array<{
  value: ContentCapability;
  title: string;
}> = [
  {
    value: "film-product",
    title: "ถ่ายสินค้าได้",
  },
  {
    value: "face-camera",
    title: "พูดหน้ากล้องได้",
  },
  {
    value: "voice-over",
    title: "พากย์เสียงได้",
  },
  {
    value: "image-only",
    title: "ใช้ภาพสินค้าอย่างเดียว",
  },
  {
    value: "no-face",
    title: "ไม่ต้องการออกหน้ากล้อง",
  },
  {
    value: "no-media",
    title: "ยังไม่มีภาพหรือวิดีโอ",
  },
];

function getInitialForm(): PlanRequest {
  return {
    productOrService: "",
    productHighlights: "",
    audience: "",
    customerConcerns: "",
    promotionDetails: "",
    prohibitedClaims: "",

    goal: "",
    platform: "",
    dailyTime: "",
    capabilities: [],

    createdAt: "",
  };
}

function readDraft(): PlanRequest {
  if (typeof window === "undefined") {
    return getInitialForm();
  }

  const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);

  if (!raw) {
    return getInitialForm();
  }

  try {
    return {
      ...getInitialForm(),
      ...(JSON.parse(raw) as PlanRequest),
      createdAt: "",
    };
  } catch {
    return getInitialForm();
  }
}

function validateStep(
  step: number,
  form: PlanRequest
): FormErrors {
  const errors: FormErrors = {};

  if (step === 1) {
    if (!form.productOrService.trim()) {
      errors.productOrService =
        "กรุณาระบุว่าคุณขายหรือทำอะไร";
    }

    if (!form.productHighlights.trim()) {
      errors.productHighlights =
        "กรุณาระบุจุดเด่นอย่างน้อย 1 ข้อ";
    }

    if (!form.audience.trim()) {
      errors.audience =
        "กรุณาระบุกลุ่มลูกค้าหลัก";
    }
  }

  if (step === 2) {
    if (!form.goal) {
      errors.goal = "กรุณาเลือกเป้าหมายหลัก";
    }

    if (!form.platform) {
      errors.platform = "กรุณาเลือกแพลตฟอร์ม";
    }

    if (!form.dailyTime) {
      errors.dailyTime =
        "กรุณาเลือกเวลาที่มีในแต่ละวัน";
    }

    if (form.capabilities.length === 0) {
      errors.capabilities =
        "กรุณาเลือกสิ่งที่คุณสามารถทำได้อย่างน้อย 1 ข้อ";
    }
  }

  return errors;
}

function hasErrors(errors: FormErrors) {
  return Object.keys(errors).length > 0;
}

export default function StartPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [form, setForm] =
    useState<PlanRequest>(getInitialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setForm(readDraft());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    window.localStorage.setItem(
      DRAFT_STORAGE_KEY,
      JSON.stringify(form)
    );
  }, [form, hydrated]);

  const completedPercent = useMemo(() => {
    return Math.round((step / 3) * 100);
  }, [step]);

  function updateField<K extends keyof PlanRequest>(
    field: K,
    value: PlanRequest[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  function toggleCapability(
    capability: ContentCapability
  ) {
    const selected =
      form.capabilities.includes(capability);

    updateField(
      "capabilities",
      selected
        ? form.capabilities.filter(
            (item) => item !== capability
          )
        : [...form.capabilities, capability]
    );
  }

  function goNext() {
    const nextErrors = validateStep(step, form);

    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    setErrors({});
    setStep((current) => Math.min(current + 1, 3));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function goBack() {
    setErrors({});
    setStep((current) => Math.max(current - 1, 1));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function createPlan() {
    const stepOneErrors = validateStep(1, form);
    const stepTwoErrors = validateStep(2, form);

    const allErrors = {
      ...stepOneErrors,
      ...stepTwoErrors,
    };

    if (hasErrors(allErrors)) {
      setErrors(allErrors);

      if (
        stepOneErrors.productOrService ||
        stepOneErrors.productHighlights ||
        stepOneErrors.audience
      ) {
        setStep(1);
      } else {
        setStep(2);
      }

      return;
    }

    const request: PlanRequest = {
      ...form,
      productOrService:
        form.productOrService.trim(),
      productHighlights:
        form.productHighlights.trim(),
      audience: form.audience.trim(),
      customerConcerns:
        form.customerConcerns.trim(),
      promotionDetails:
        form.promotionDetails.trim(),
      prohibitedClaims:
        form.prohibitedClaims.trim(),
      createdAt: new Date().toISOString(),
    };

    window.localStorage.setItem(
      REQUEST_STORAGE_KEY,
      JSON.stringify(request)
    );

    router.push("/checkout");
  }

  function resetForm() {
    const confirmed = window.confirm(
      "ต้องการล้างข้อมูลที่กรอกไว้ทั้งหมดหรือไม่?"
    );

    if (!confirmed) return;

    const emptyForm = getInitialForm();

    setForm(emptyForm);
    setErrors({});
    setStep(1);

    window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    window.localStorage.removeItem(REQUEST_STORAGE_KEY);
  }

  return (
    <main style={pageStyle}>
      <section style={heroStyle}>
        <p style={heroLabelStyle}>
          สร้างแผนคอนเทนต์พร้อมทำ
        </p>

        <h1 style={heroTitleStyle}>
          บอกข้อมูลของคุณ แล้วให้ระบบจัดแผน 7 วัน
        </h1>

        <p style={heroSubtitleStyle}>
          ไม่ต้องเขียน Prompt ไม่ต้องเลือก Hook
          หรือประกอบสคริปต์เอง
          ตอบคำถามสั้น ๆ เพียง 3 ขั้นตอน
        </p>

        <div style={progressHeaderStyle}>
          <span>ขั้นที่ {step} จาก 3</span>
          <strong>{completedPercent}%</strong>
        </div>

        <div style={progressOuterStyle}>
          <div
            style={{
              ...progressInnerStyle,
              width: `${completedPercent}%`,
            }}
          />
        </div>
      </section>

      <section style={stepNavigationStyle}>
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            style={
              item === step
                ? activeStepItemStyle
                : item < step
                  ? completedStepItemStyle
                  : stepItemStyle
            }
          >
            <span style={stepNumberStyle}>{item}</span>

            <span>
              {item === 1 && "ข้อมูลสินค้า"}
              {item === 2 && "เป้าหมายและความพร้อม"}
              {item === 3 && "ตรวจข้อมูล"}
            </span>
          </div>
        ))}
      </section>

      {step === 1 ? (
        <section style={formSectionStyle}>
          <div style={sectionHeadingStyle}>
            <p style={sectionLabelStyle}>ขั้นที่ 1</p>

            <h2 style={sectionTitleStyle}>
              บอกข้อมูลสินค้า ธุรกิจ หรือบริการ
            </h2>

            <p style={sectionDescriptionStyle}>
              ระบบจะใช้เฉพาะข้อมูลที่คุณให้
              และไม่ควรแต่งคุณสมบัติสินค้าเพิ่มเติมเอง
            </p>
          </div>

          <div style={fieldGridStyle}>
            <Field
              label="คุณขายหรือทำอะไร?"
              required
              error={errors.productOrService}
            >
              <input
                value={form.productOrService}
                onChange={(event) =>
                  updateField(
                    "productOrService",
                    event.target.value
                  )
                }
                placeholder="ตัวอย่าง: กระเป๋าใบใหญ่สำหรับใส่ของประจำวัน"
                style={inputStyle}
              />
            </Field>

            <Field
              label="กลุ่มลูกค้าหลักคือใคร?"
              required
              error={errors.audience}
            >
              <input
                value={form.audience}
                onChange={(event) =>
                  updateField(
                    "audience",
                    event.target.value
                  )
                }
                placeholder="ตัวอย่าง: คนทำงาน นักศึกษา และคนที่ต้องพกของหลายชิ้น"
                style={inputStyle}
              />
            </Field>
          </div>

          <Field
            label="จุดเด่นของสินค้าหรือบริการ"
            required
            error={errors.productHighlights}
            helpText="เขียนแยกบรรทัดได้ ระบบจะนำไปใช้เป็นข้อมูลหลักของแผน"
          >
            <textarea
              value={form.productHighlights}
              onChange={(event) =>
                updateField(
                  "productHighlights",
                  event.target.value
                )
              }
              placeholder={
                "ตัวอย่าง:\nใส่ของได้หลายชิ้น\nหูหิ้วมีสายสลิงช่วยเสริมการรับแรง\nเหมาะกับการใช้งานประจำวัน"
              }
              style={textareaStyle}
            />
          </Field>

          <Field
            label="ลูกค้ามักสงสัยหรือกังวลเรื่องอะไร?"
            helpText="เว้นว่างได้ แต่ข้อมูลนี้ช่วยให้ระบบสร้างคอนเทนต์ตอบข้อสงสัยได้ตรงขึ้น"
          >
            <textarea
              value={form.customerConcerns}
              onChange={(event) =>
                updateField(
                  "customerConcerns",
                  event.target.value
                )
              }
              placeholder={
                "ตัวอย่าง:\nกลัวขนาดไม่ตรงกับที่คิด\nไม่แน่ใจว่าใส่ของได้มากแค่ไหน\nกังวลเรื่องความแข็งแรง"
              }
              style={textareaStyle}
            />
          </Field>

          <div style={fieldGridStyle}>
            <Field
              label="ราคา โปรโมชั่น หรือรายละเอียดที่ต้องกล่าวถึง"
              helpText="เว้นว่างได้"
            >
              <textarea
                value={form.promotionDetails}
                onChange={(event) =>
                  updateField(
                    "promotionDetails",
                    event.target.value
                  )
                }
                placeholder="ตัวอย่าง: มีส่วนลดช่วงเปิดตัว หรือให้ตรวจรายละเอียดราคาที่หน้าสินค้า"
                style={smallTextareaStyle}
              />
            </Field>

            <Field
              label="สิ่งที่ห้ามพูดหรือไม่ต้องการให้กล่าวอ้าง"
              helpText="ช่วยป้องกันข้อความเกินจริง"
            >
              <textarea
                value={form.prohibitedClaims}
                onChange={(event) =>
                  updateField(
                    "prohibitedClaims",
                    event.target.value
                  )
                }
                placeholder="ตัวอย่าง: ห้ามระบุน้ำหนักสูงสุด เพราะยังไม่มีผลทดสอบ"
                style={smallTextareaStyle}
              />
            </Field>
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section style={formSectionStyle}>
          <div style={sectionHeadingStyle}>
            <p style={sectionLabelStyle}>ขั้นที่ 2</p>

            <h2 style={sectionTitleStyle}>
              เลือกเป้าหมาย แพลตฟอร์ม และเวลาที่มี
            </h2>

            <p style={sectionDescriptionStyle}>
              ระบบจะปรับจำนวนงานและรูปแบบคอนเทนต์
              ให้ตรงกับความพร้อมของคุณ
            </p>
          </div>

          <ChoiceSection
            title="เป้าหมายหลักของคุณ"
            error={errors.goal}
          >
            {GOAL_OPTIONS.map((option) => (
              <ChoiceCard
                key={option.value}
                selected={form.goal === option.value}
                title={option.title}
                description={option.description}
                onClick={() =>
                  updateField("goal", option.value)
                }
              />
            ))}
          </ChoiceSection>

          <ChoiceSection
            title="คุณจะโพสต์ที่แพลตฟอร์มไหน?"
            error={errors.platform}
          >
            {PLATFORM_OPTIONS.map((option) => (
              <ChoiceCard
                key={option.value}
                selected={
                  form.platform === option.value
                }
                title={option.title}
                description={option.description}
                onClick={() =>
                  updateField(
                    "platform",
                    option.value
                  )
                }
              />
            ))}
          </ChoiceSection>

          <ChoiceSection
            title="คุณมีเวลาทำคอนเทนต์วันละประมาณเท่าไร?"
            error={errors.dailyTime}
          >
            {TIME_OPTIONS.map((option) => (
              <ChoiceCard
                key={option.value}
                selected={
                  form.dailyTime === option.value
                }
                title={option.title}
                description={option.description}
                onClick={() =>
                  updateField(
                    "dailyTime",
                    option.value
                  )
                }
              />
            ))}
          </ChoiceSection>

          <section style={choiceSectionStyle}>
            <h3 style={choiceSectionTitleStyle}>
              คุณสามารถทำอะไรได้บ้าง?
            </h3>

            <p style={choiceHelpTextStyle}>
              เลือกได้มากกว่า 1 ข้อ
              ระบบจะไม่สร้างงานที่เกินความสามารถของคุณ
            </p>

            {errors.capabilities ? (
              <p style={errorTextStyle}>
                {errors.capabilities}
              </p>
            ) : null}

            <div style={capabilityGridStyle}>
              {CAPABILITY_OPTIONS.map((option) => {
                const selected =
                  form.capabilities.includes(
                    option.value
                  );

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      toggleCapability(option.value)
                    }
                    style={
                      selected
                        ? selectedCapabilityStyle
                        : capabilityStyle
                    }
                  >
                    <span style={checkboxStyle}>
                      {selected ? "✓" : ""}
                    </span>

                    <span>{option.title}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </section>
      ) : null}

      {step === 3 ? (
        <section style={formSectionStyle}>
          <div style={sectionHeadingStyle}>
            <p style={sectionLabelStyle}>ขั้นที่ 3</p>

            <h2 style={sectionTitleStyle}>
              ตรวจข้อมูลก่อนสร้างแผน
            </h2>

            <p style={sectionDescriptionStyle}>
              แผนรุ่นนี้จะสร้างคอนเทนต์พร้อมทำ 7 วัน
              โดยใช้ข้อมูลด้านล่างเป็นหลัก
            </p>
          </div>

          <div style={summaryGridStyle}>
            <SummaryCard
              label="สินค้า ธุรกิจ หรือบริการ"
              value={form.productOrService}
            />

            <SummaryCard
              label="กลุ่มลูกค้า"
              value={form.audience}
            />

            <SummaryCard
              label="เป้าหมาย"
              value={
                GOAL_OPTIONS.find(
                  (option) =>
                    option.value === form.goal
                )?.title || "-"
              }
            />

            <SummaryCard
              label="แพลตฟอร์ม"
              value={
                PLATFORM_OPTIONS.find(
                  (option) =>
                    option.value === form.platform
                )?.title || "-"
              }
            />

            <SummaryCard
              label="เวลาที่มี"
              value={
                TIME_OPTIONS.find(
                  (option) =>
                    option.value === form.dailyTime
                )?.title || "-"
              }
            />

            <SummaryCard
              label="สิ่งที่สามารถทำได้"
              value={
                form.capabilities
                  .map(
                    (capability) =>
                      CAPABILITY_OPTIONS.find(
                        (option) =>
                          option.value === capability
                      )?.title
                  )
                  .filter(Boolean)
                  .join(", ") || "-"
              }
            />
          </div>

          <article style={largeSummaryCardStyle}>
            <p style={summaryLabelStyle}>
              จุดเด่นที่ระบบจะใช้
            </p>

            <p style={preserveTextStyle}>
              {form.productHighlights || "-"}
            </p>
          </article>

          <article style={largeSummaryCardStyle}>
            <p style={summaryLabelStyle}>
              ข้อสงสัยหรือความกังวลของลูกค้า
            </p>

            <p style={preserveTextStyle}>
              {form.customerConcerns ||
                "ยังไม่ได้ระบุ ระบบจะใช้แนวคำถามทั่วไปที่ไม่แต่งข้อมูลสินค้า"}
            </p>
          </article>

          <article style={resultPreviewStyle}>
            <p style={resultPreviewLabelStyle}>
              สิ่งที่คุณจะได้รับ
            </p>

            <h3 style={resultPreviewTitleStyle}>
              แผนคอนเทนต์พร้อมทำครบ 7 วัน
            </h3>

            <div style={resultFeatureGridStyle}>
              {[
                "เป้าหมายและหลักการของแต่ละวัน",
                "หัวข้อและประโยคเปิด",
                "บทพูดหรือเนื้อหาพร้อมใช้",
                "ลำดับการถ่ายและข้อความบนจอ",
                "แคปชัน คำปิด และแฮชแท็ก",
                "เวลาโพสต์แบบเริ่มต้นทดลอง",
                "แผนสำรองเมื่อทำคลิปไม่ได้",
                "งานหลังโพสต์และตัวอย่างตอบความคิดเห็น",
                "ตัวชี้วัดที่ควรบันทึก",
              ].map((item) => (
                <div
                  key={item}
                  style={resultFeatureStyle}
                >
                  ✓ {item}
                </div>
              ))}
            </div>
          </article>
        </section>
      ) : null}

      <section style={actionBarStyle}>
        <div>
          {step > 1 ? (
            <button
              type="button"
              onClick={goBack}
              style={backButtonStyle}
            >
              ย้อนกลับ
            </button>
          ) : (
            <button
              type="button"
              onClick={resetForm}
              style={resetButtonStyle}
            >
              ล้างข้อมูล
            </button>
          )}
        </div>

        <div>
          {step < 3 ? (
            <button
              type="button"
              onClick={goNext}
              style={nextButtonStyle}
            >
              ขั้นตอนถัดไป
            </button>
          ) : (
            <button
              type="button"
              onClick={createPlan}
              style={createButtonStyle}
            >
              ไปตรวจข้อมูลและชำระเงิน
            </button>
          )}
        </div>
      </section>
    </main>
  );
}

type FieldProps = {
  label: string;
  required?: boolean;
  helpText?: string;
  error?: string;
  children: React.ReactNode;
};

function Field({
  label,
  required,
  helpText,
  error,
  children,
}: FieldProps) {
  return (
    <label style={fieldStyle}>
      <span style={fieldLabelStyle}>
        {label}

        {required ? (
          <span style={requiredStyle}> *</span>
        ) : null}
      </span>

      {helpText ? (
        <span style={helpTextStyle}>{helpText}</span>
      ) : null}

      {children}

      {error ? (
        <span style={errorTextStyle}>{error}</span>
      ) : null}
    </label>
  );
}

type ChoiceSectionProps = {
  title: string;
  error?: string;
  children: React.ReactNode;
};

function ChoiceSection({
  title,
  error,
  children,
}: ChoiceSectionProps) {
  return (
    <section style={choiceSectionStyle}>
      <h3 style={choiceSectionTitleStyle}>{title}</h3>

      {error ? (
        <p style={errorTextStyle}>{error}</p>
      ) : null}

      <div style={choiceGridStyle}>{children}</div>
    </section>
  );
}

type ChoiceCardProps = {
  selected: boolean;
  title: string;
  description: string;
  onClick: () => void;
};

function ChoiceCard({
  selected,
  title,
  description,
  onClick,
}: ChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={
        selected
          ? selectedChoiceCardStyle
          : choiceCardStyle
      }
    >
      <div style={choiceTopRowStyle}>
        <strong>{title}</strong>

        <span style={radioStyle}>
          {selected ? "●" : ""}
        </span>
      </div>

      <p style={choiceDescriptionStyle}>
        {description}
      </p>
    </button>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <article style={summaryCardStyle}>
      <p style={summaryLabelStyle}>{label}</p>
      <p style={summaryValueStyle}>{value}</p>
    </article>
  );
}

const pageStyle: CSSProperties = {
  maxWidth: "1050px",
  margin: "0 auto",
  padding: "24px",
};

const heroStyle: CSSProperties = {
  padding: "36px 24px",
  borderRadius: "28px",
  background:
    "linear-gradient(135deg, #111827 0%, #312e81 55%, #4f46e5 100%)",
  color: "white",
};

const heroLabelStyle: CSSProperties = {
  margin: 0,
  color: "#c7d2fe",
  fontWeight: 800,
};

const heroTitleStyle: CSSProperties = {
  margin: "12px 0",
  maxWidth: "800px",
  fontSize: "clamp(32px, 6vw, 48px)",
  lineHeight: 1.15,
};

const heroSubtitleStyle: CSSProperties = {
  margin: 0,
  maxWidth: "760px",
  color: "#e0e7ff",
  fontSize: "18px",
  lineHeight: 1.8,
};

const progressHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  marginTop: "24px",
  color: "#e0e7ff",
};

const progressOuterStyle: CSSProperties = {
  height: "10px",
  marginTop: "9px",
  overflow: "hidden",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.2)",
};

const progressInnerStyle: CSSProperties = {
  height: "100%",
  borderRadius: "999px",
  background: "white",
  transition: "width 0.2s ease",
};

const stepNavigationStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "10px",
  marginTop: "20px",
};

const stepItemStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "9px",
  padding: "14px",
  borderRadius: "16px",
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
  color: "#64748b",
  fontWeight: 700,
};

const activeStepItemStyle: CSSProperties = {
  ...stepItemStyle,
  border: "2px solid #4f46e5",
  background: "#eef2ff",
  color: "#312e81",
};

const completedStepItemStyle: CSSProperties = {
  ...stepItemStyle,
  border: "1px solid #a7f3d0",
  background: "#ecfdf5",
  color: "#047857",
};

const stepNumberStyle: CSSProperties = {
  display: "inline-flex",
  width: "28px",
  height: "28px",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "999px",
  background: "white",
  border: "1px solid currentColor",
};

const formSectionStyle: CSSProperties = {
  marginTop: "20px",
  padding: "24px",
  borderRadius: "24px",
  border: "1px solid #e5e7eb",
  background: "white",
};

const sectionHeadingStyle: CSSProperties = {
  marginBottom: "22px",
};

const sectionLabelStyle: CSSProperties = {
  margin: 0,
  color: "#4f46e5",
  fontWeight: 800,
};

const sectionTitleStyle: CSSProperties = {
  margin: "7px 0",
  fontSize: "30px",
};

const sectionDescriptionStyle: CSSProperties = {
  margin: 0,
  color: "#475569",
  lineHeight: 1.7,
};

const fieldGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "16px",
};

const fieldStyle: CSSProperties = {
  display: "block",
  marginBottom: "18px",
};

const fieldLabelStyle: CSSProperties = {
  display: "block",
  marginBottom: "7px",
  color: "#111827",
  fontWeight: 800,
};

const requiredStyle: CSSProperties = {
  color: "#dc2626",
};

const helpTextStyle: CSSProperties = {
  display: "block",
  margin: "-2px 0 8px",
  color: "#64748b",
  fontSize: "14px",
  lineHeight: 1.5,
};

const inputStyle: CSSProperties = {
  width: "100%",
  minHeight: "46px",
  boxSizing: "border-box",
  padding: "11px 13px",
  borderRadius: "13px",
  border: "1px solid #cbd5e1",
  background: "white",
  fontSize: "16px",
};

const textareaStyle: CSSProperties = {
  width: "100%",
  minHeight: "130px",
  boxSizing: "border-box",
  padding: "12px 14px",
  borderRadius: "13px",
  border: "1px solid #cbd5e1",
  background: "white",
  fontSize: "16px",
  lineHeight: 1.7,
  resize: "vertical",
};

const smallTextareaStyle: CSSProperties = {
  ...textareaStyle,
  minHeight: "105px",
};

const errorTextStyle: CSSProperties = {
  display: "block",
  margin: "7px 0 0",
  color: "#dc2626",
  fontSize: "14px",
  fontWeight: 700,
};

const choiceSectionStyle: CSSProperties = {
  marginTop: "26px",
};

const choiceSectionTitleStyle: CSSProperties = {
  margin: "0 0 10px",
};

const choiceHelpTextStyle: CSSProperties = {
  margin: "-3px 0 12px",
  color: "#64748b",
};

const choiceGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "12px",
};

const choiceCardStyle: CSSProperties = {
  padding: "17px",
  textAlign: "left",
  borderRadius: "17px",
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
  cursor: "pointer",
};

const selectedChoiceCardStyle: CSSProperties = {
  ...choiceCardStyle,
  border: "2px solid #4f46e5",
  background: "#eef2ff",
};

const choiceTopRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
};

const radioStyle: CSSProperties = {
  display: "inline-flex",
  width: "21px",
  height: "21px",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "999px",
  border: "1px solid #4f46e5",
  color: "#4f46e5",
};

const choiceDescriptionStyle: CSSProperties = {
  margin: "9px 0 0",
  color: "#475569",
  lineHeight: 1.6,
};

const capabilityGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "10px",
};

const capabilityStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "14px",
  textAlign: "left",
  borderRadius: "15px",
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
  cursor: "pointer",
  fontWeight: 700,
};

const selectedCapabilityStyle: CSSProperties = {
  ...capabilityStyle,
  border: "2px solid #4f46e5",
  background: "#eef2ff",
  color: "#312e81",
};

const checkboxStyle: CSSProperties = {
  display: "inline-flex",
  width: "22px",
  height: "22px",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "6px",
  border: "1px solid #4f46e5",
  background: "white",
  color: "#4f46e5",
};

const summaryGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(230px, 1fr))",
  gap: "12px",
};

const summaryCardStyle: CSSProperties = {
  padding: "17px",
  borderRadius: "17px",
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
};

const largeSummaryCardStyle: CSSProperties = {
  marginTop: "14px",
  padding: "18px",
  borderRadius: "18px",
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
};

const summaryLabelStyle: CSSProperties = {
  margin: "0 0 7px",
  color: "#4f46e5",
  fontWeight: 800,
};

const summaryValueStyle: CSSProperties = {
  margin: 0,
  color: "#111827",
  lineHeight: 1.7,
};

const preserveTextStyle: CSSProperties = {
  margin: 0,
  color: "#334155",
  lineHeight: 1.7,
  whiteSpace: "pre-line",
};

const resultPreviewStyle: CSSProperties = {
  marginTop: "20px",
  padding: "22px",
  borderRadius: "22px",
  border: "1px solid #bbf7d0",
  background: "#f0fdf4",
};

const resultPreviewLabelStyle: CSSProperties = {
  margin: 0,
  color: "#15803d",
  fontWeight: 800,
};

const resultPreviewTitleStyle: CSSProperties = {
  margin: "8px 0 14px",
  color: "#14532d",
};

const resultFeatureGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "9px",
};

const resultFeatureStyle: CSSProperties = {
  padding: "10px 12px",
  borderRadius: "12px",
  background: "white",
  color: "#166534",
  lineHeight: 1.5,
};

const actionBarStyle: CSSProperties = {
  position: "sticky",
  bottom: "12px",
  zIndex: 10,
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  marginTop: "20px",
  padding: "14px",
  borderRadius: "18px",
  border: "1px solid #e5e7eb",
  background: "rgba(255,255,255,0.96)",
  boxShadow: "0 12px 30px rgba(15,23,42,0.12)",
};

const nextButtonStyle: CSSProperties = {
  padding: "12px 18px",
  borderRadius: "13px",
  border: "1px solid #4f46e5",
  background: "#4f46e5",
  color: "white",
  cursor: "pointer",
  fontWeight: 800,
};

const createButtonStyle: CSSProperties = {
  ...nextButtonStyle,
  background: "#047857",
  border: "1px solid #047857",
};

const backButtonStyle: CSSProperties = {
  padding: "12px 18px",
  borderRadius: "13px",
  border: "1px solid #cbd5e1",
  background: "white",
  color: "#111827",
  cursor: "pointer",
  fontWeight: 800,
};

const resetButtonStyle: CSSProperties = {
  ...backButtonStyle,
  color: "#b91c1c",
};
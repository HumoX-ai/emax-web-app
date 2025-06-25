/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSendOtpMutation, useVerifyOtpMutation } from "../store/api/authApi";
import { useAppDispatch } from "../store/hooks";
import { setCredentials } from "../store/slices/authSlice";
import { useSearchParams, useNavigate } from "react-router";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../components/ui/form";
import TelegramMainButton from "../components/TelegramMainButton";
import { PhoneInput } from "@/components/ui/phone-input";
import { InputOTP, InputOTPSlot } from "../components/ui/input-otp";
import { toast } from "sonner";
import { useUpdateUserMutation } from "../store/api/userApi";
import UpdateUserForm from "../components/auth/UpdateUserForm";

const phoneSchema = z.object({
  phone: z
    .string()
    .min(9, "Telefon raqam kamida 9 ta raqamdan iborat bo'lishi kerak"),
});

const codeSchema = z.object({
  phone: z.string(),
  code: z.string().min(5, "Kod 5 ta raqamdan iborat bo'lishi kerak"),
});

const updateUserSchema = z.object({
  fullName: z.string().min(3, "Ism familiya majburiy"),
  birthday: z.string().min(4, "Tug'ilgan sana majburiy"),
  gender: z.enum(["MALE", "FEMALE"], { required_error: "Jins majburiy" }),
});

type AuthFormValues = z.infer<typeof phoneSchema | typeof codeSchema>;
type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

const AuthPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState<"phone" | "code" | "update">("phone");
  const [phone, setPhone] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(step === "code" ? codeSchema : phoneSchema),
    defaultValues: { phone: "", code: "" },
  });

  const updateUserForm = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: { fullName: "", birthday: "", gender: "MALE" },
  });
  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();
  const updateUserFormRef = useRef<HTMLFormElement>(null!);
  const [searchParams, setSearchParams] = useSearchParams();

  // Restore state and form values from URL params on mount
  useEffect(() => {
    const stepParam = searchParams.get("step");
    const phoneParam = searchParams.get("phone");
    const isNewUserParam = searchParams.get("isNewUser");
    const codeParam = searchParams.get("code");
    const fullNameParam = searchParams.get("fullName");
    const birthdayParam = searchParams.get("birthday");
    const genderParam = searchParams.get("gender");
    if (stepParam) setStep(stepParam as any);
    if (phoneParam) setPhone(phoneParam);
    if (isNewUserParam) setIsNewUser(isNewUserParam === "true");
    if (phoneParam) form.setValue("phone", phoneParam);
    if (codeParam) form.setValue("code", codeParam);
    if (fullNameParam) updateUserForm.setValue("fullName", fullNameParam);
    if (birthdayParam) updateUserForm.setValue("birthday", birthdayParam);
    if (genderParam) updateUserForm.setValue("gender", genderParam as any);
  }, []);

  // Sync state and form values to URL params on change
  useEffect(() => {
    setSearchParams({
      step,
      phone,
      isNewUser: String(isNewUser),
      code: form.watch("code") || "",
      fullName: updateUserForm.watch("fullName") || "",
      birthday: updateUserForm.watch("birthday") || "",
      gender: updateUserForm.watch("gender") || "",
    });
  }, [step, phone, isNewUser, form, updateUserForm, setSearchParams]);

  const onSubmit = useCallback(
    async (data: AuthFormValues) => {
      if (step === "phone") {
        try {
          await sendOtp({ phone: data.phone }).unwrap();
          setPhone(data.phone);
          setStep("code");
          setCanResend(false);
          toast.success("SMS kod yuborildi");
        } catch (error) {
          form.setError("phone", {
            type: "manual",
            message: "Xatolik yuz berdi",
          });
          toast.error("SMS yuborishda xatolik yuz berdi", {
            description: (error as any)?.data?.message,
          });
        }
      } else if (step === "code") {
        try {
          const res = await verifyOtp({
            phone,
            code: (data as { code: string }).code || "",
          }).unwrap();
          localStorage.setItem("token", res.token); // Always save token after OTP verification
          if (res.isNewUser) {
            setIsNewUser(true);
            setStep("update");
            toast.success("Yangi foydalanuvchi. Ma'lumotlarni to'ldiring");
          } else {
            dispatch(
              setCredentials({
                user: res.user,
                token: res.token,
                isNewUser: res.isNewUser,
              })
            );
            toast.success("Muvaffaqiyatli kirdingiz!");
            navigate("/", { replace: true });
          }
        } catch (error) {
          form.setError("code", {
            type: "manual",
            message: "Kod xato yoki muddati tugagan",
          });
          toast.error("Kod xato yoki muddati tugagan", {
            description: (error as any)?.data?.message,
          });
          setCanResend(true); // Kod muddati tugaganida qayta yuborish imkonini yoqish
        }
      }
    },
    [step, sendOtp, verifyOtp, dispatch, navigate, phone, form]
  );

  // Update user submit
  const onUpdateUser = async (data: UpdateUserFormValues) => {
    try {
      const res = await updateUser(data).unwrap();
      dispatch(
        setCredentials({
          user: res.user,
          token: localStorage.getItem("token") || "",
          isNewUser: false,
        })
      );
      toast.success("Ma'lumotlar saqlandi!");
      navigate("/", { replace: true });
    } catch (error) {
      updateUserForm.setError("fullName", {
        type: "manual",
        message: "Xatolik yuz berdi",
      });
      toast.error("Ma'lumotlarni saqlashda xatolik", {
        description: (error as any)?.data?.message,
      });
    }
  };

  // MainButton props
  const mainButtonText =
    step === "phone"
      ? isSendingOtp
        ? "Yuborilmoqda..."
        : "SMS kod olish"
      : step === "code"
      ? isVerifyingOtp
        ? "Tekshirilmoqda..."
        : "Kirish"
      : isUpdatingUser
      ? "Saqlanmoqda..."
      : "Saqlash";
  const mainButtonLoading = isSendingOtp || isVerifyingOtp || isUpdatingUser;
  const mainButtonDisabled = isSendingOtp || isVerifyingOtp || isUpdatingUser;

  // MainButton onClick handler
  const handleMainButtonClick = () => {
    if (step === "update" && isNewUser) {
      updateUserFormRef.current?.requestSubmit();
    } else {
      form.handleSubmit(onSubmit)();
    }
  };

  // Qayta yuborish handler
  const handleResend = async () => {
    try {
      await sendOtp({ phone }).unwrap();
      setCanResend(false);
      form.setValue("code", ""); // Qayta yuborishda kod maydonini tozalash
      toast.success("SMS kod qayta yuborildi");
    } catch (error) {
      toast.error("SMS yuborishda xatolik", {
        description: (error as any)?.data?.message,
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-4 bg-background text-foreground">
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-sm text-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Kirish</h1>
            <p className="text-muted-foreground">
              {step === "phone" && "Telefon raqamingizni kiriting"}
              {step === "code" && `SMS-kod ${phone} raqamiga yuborildi`}
              {step === "update" && "Shaxsiy ma'lumotlar"}
            </p>
          </div>

          {!isNewUser && step !== "update" && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 text-left"
              >
                {step === "phone" && (
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefon raqam</FormLabel>
                        <FormControl>
                          <PhoneInput
                            {...field}
                            defaultCountry="UZ"
                            placeholder="99 123 45 67"
                            international={false}
                            limitMaxLength
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {step === "code" && (
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <InputOTP
                            maxLength={5}
                            {...field}
                            autoFocus
                            containerClassName="justify-center"
                          >
                            {[...Array(5)].map((_, i) => (
                              <InputOTPSlot
                                key={i}
                                index={i}
                                className="bg-input border-border"
                              />
                            ))}
                          </InputOTP>
                        </FormControl>
                        <FormMessage className="text-center" />
                      </FormItem>
                    )}
                  />
                )}
              </form>
            </Form>
          )}

          {isNewUser && step === "update" && (
            <UpdateUserForm
              onSubmit={onUpdateUser}
              loading={isUpdatingUser}
              formRef={updateUserFormRef}
            />
          )}

          {step === "code" && (
            <div className="flex flex-col items-center gap-2 mb-4 mt-1">
              <div className="text-gray-500 text-sm">
                {phone}
                <button
                  type="button"
                  className="ml-2 text-primary underline text-xs font-medium"
                  onClick={() => {
                    setStep("phone");
                  }}
                >
                  Raqamni o‘zgartirish
                </button>
              </div>
            </div>
          )}

          {step === "code" && (
            <div className="mt-4 text-center">
              <button
                type="button"
                className="text-primary underline text-sm"
                onClick={handleResend}
                disabled={isSendingOtp || !canResend}
              >
                {canResend
                  ? "Kodni qayta yuborish"
                  : "Kodni qayta yuborish uchun kuting..."}
              </button>
            </div>
          )}
        </div>
      </div>
      <TelegramMainButton
        text={mainButtonText}
        loading={mainButtonLoading}
        disabled={mainButtonDisabled}
        onClick={handleMainButtonClick}
      />
    </div>
  );
};

export default AuthPage;

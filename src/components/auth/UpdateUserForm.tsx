import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { forwardRef } from "react";
import { format } from "date-fns";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon, User } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { uz } from "date-fns/locale";

const updateUserSchema = z.object({
  fullName: z.string().min(2, "Ism kamida 2 ta harf bo'lishi kerak"),
  birthday: z.string().min(4, "Tug'ilgan sana majburiy"),
  gender: z.enum(["MALE", "FEMALE"], { required_error: "Jinsni tanlang" }),
});

type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

interface UpdateUserFormProps {
  defaultValues?: Partial<UpdateUserFormValues>;
  onSubmit: (values: UpdateUserFormValues) => void;
  loading?: boolean;
  formRef?: React.RefObject<HTMLFormElement>;
}

const UpdateUserForm = forwardRef<HTMLFormElement, UpdateUserFormProps>(
  ({ defaultValues, onSubmit, formRef }) => {
    const form = useForm<UpdateUserFormValues>({
      resolver: zodResolver(updateUserSchema),
      defaultValues: {
        ...defaultValues,
        birthday: defaultValues?.birthday || "", // ensure it's a string
      },
    });

    return (
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 bg-white p-6 rounded-lg shadow-sm border"
        >
          <div className="space-y-1 mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Ma'lumotlarni to'ldiring
            </h2>
            <p className="text-sm text-gray-600">
              Quyidagi ma'lumotlarni to'g'ri to'ldiring
            </p>
          </div>
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Ism va familiya
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Masalan: Ahmadjon Valijonov"
                      className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birthday"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Tug'ilgan sana
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full h-12 pl-10 text-left font-normal border-gray-200 hover:border-blue-500 focus:border-blue-500 focus:ring-blue-500",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "dd MMMM yyyy", {
                            locale: uz,
                          })
                        ) : (
                          <span className="text-gray-500">Sanani tanlang</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 text-gray-400" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 border shadow-lg"
                    align="start"
                  >
                    <Calendar
                      locale={uz}
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) =>
                        field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                      }
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      captionLayout="dropdown"
                      className="rounded-md"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Jins
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue
                        placeholder="Jinsni tanlang"
                        className="text-gray-500"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="border shadow-lg">
                    <SelectItem
                      value="MALE"
                      className="cursor-pointer hover:bg-blue-50"
                    >
                      <div className="flex items-center space-x-2">
                        <span>👨</span>
                        <span>Erkak</span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="FEMALE"
                      className="cursor-pointer hover:bg-blue-50"
                    >
                      <div className="flex items-center space-x-2">
                        <span>👩</span>
                        <span>Ayol</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
        </form>
      </Form>
    );
  }
);

export default UpdateUserForm;

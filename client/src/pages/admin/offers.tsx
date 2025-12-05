import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Plus, 
  Pencil, 
  Trash2,
  Tag,
  Sparkles
} from "lucide-react";
import type { Offer } from "@shared/schema";

const offerSchema = z.object({
  title: z.string().min(2, "عنوان العرض مطلوب"),
  description: z.string().min(5, "وصف العرض مطلوب"),
  originalPrice: z.string().optional(),
  discountPrice: z.string().min(1, "السعر مطلوب"),
  badge: z.string().optional(),
  badgeColor: z.string().default("destructive"),
  icon: z.string().default("sparkles"),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

type OfferForm = z.infer<typeof offerSchema>;

const iconOptions = [
  { value: "sparkles", label: "💎 ماسة" },
  { value: "crown", label: "👑 تاج" },
  { value: "party", label: "🎊 احتفال" },
  { value: "fire", label: "🔥 نار" },
  { value: "star", label: "⭐ نجمة" },
  { value: "heart", label: "❤️ قلب" },
  { value: "gem", label: "💠 جوهرة" },
  { value: "gift", label: "🎁 هدية" },
];

const badgeColorOptions = [
  { value: "destructive", label: "أحمر" },
  { value: "default", label: "أخضر" },
  { value: "amber", label: "ذهبي" },
  { value: "secondary", label: "رمادي" },
];

export default function AdminOffers() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  const form = useForm<OfferForm>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      title: "",
      description: "",
      originalPrice: "",
      discountPrice: "",
      badge: "",
      badgeColor: "destructive",
      icon: "sparkles",
      isActive: true,
      sortOrder: 0,
    },
  });

  const { data: offers, isLoading: offersLoading } = useQuery<Offer[]>({
    queryKey: ["/api/offers"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: OfferForm) => {
      return await apiRequest("POST", "/api/offers", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/offers"] });
      toast({ title: "تم إضافة العرض بنجاح" });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "غير مصرح",
          description: "جاري إعادة توجيهك...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة العرض",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: OfferForm }) => {
      return await apiRequest("PUT", `/api/offers/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/offers"] });
      toast({ title: "تم تحديث العرض بنجاح" });
      setIsDialogOpen(false);
      setEditingOffer(null);
      form.reset();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "غير مصرح",
          description: "جاري إعادة توجيهك...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث العرض",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/offers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/offers"] });
      toast({ title: "تم حذف العرض بنجاح" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "غير مصرح",
          description: "جاري إعادة توجيهك...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف العرض",
        variant: "destructive",
      });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      return await apiRequest("PATCH", `/api/offers/${id}/toggle`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/offers"] });
      toast({ title: "تم تحديث حالة العرض" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "غير مصرح",
          description: "جاري إعادة توجيهك...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث الحالة",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "غير مصرح",
        description: "يرجى تسجيل الدخول",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [authLoading, isAuthenticated, toast]);

  useEffect(() => {
    if (!authLoading && user && !user.isAdmin) {
      toast({
        title: "غير مصرح",
        description: "ليس لديك صلاحيات الوصول",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }
  }, [authLoading, user, toast]);

  const openEditDialog = (offer: Offer) => {
    setEditingOffer(offer);
    form.reset({
      title: offer.title,
      description: offer.description,
      originalPrice: offer.originalPrice || "",
      discountPrice: offer.discountPrice,
      badge: offer.badge || "",
      badgeColor: offer.badgeColor || "destructive",
      icon: offer.icon || "sparkles",
      isActive: offer.isActive ?? true,
      sortOrder: offer.sortOrder || 0,
    });
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingOffer(null);
    form.reset({
      title: "",
      description: "",
      originalPrice: "",
      discountPrice: "",
      badge: "",
      badgeColor: "destructive",
      icon: "sparkles",
      isActive: true,
      sortOrder: (offers?.length || 0) + 1,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: OfferForm) => {
    if (editingOffer) {
      updateMutation.mutate({ id: editingOffer.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (authLoading) {
    return (
      <AdminLayout title="إدارة العروض">
        <div className="space-y-6">
          <Skeleton className="h-10 w-32" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!user?.isAdmin) {
    return null;
  }

  const getIconEmoji = (icon: string) => {
    const iconOption = iconOptions.find(o => o.value === icon);
    return iconOption?.label.split(" ")[0] || "💎";
  };

  return (
    <AdminLayout title="إدارة العروض">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-muted-foreground font-tajawal">
              أضف وعدّل العروض المعروضة للعملاء
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog} className="gap-2" data-testid="button-add-offer">
                <Plus className="w-4 h-4" />
                <span>إضافة عرض جديد</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingOffer ? "تعديل العرض" : "إضافة عرض جديد"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>عنوان العرض</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="مثال: جلسة تجريبية أولى" data-testid="input-offer-title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="icon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الأيقونة</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-offer-icon">
                                <SelectValue placeholder="اختر أيقونة" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {iconOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>وصف العرض</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="وصف تفصيلي للعرض..."
                            rows={3}
                            className="resize-none"
                            data-testid="input-offer-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="originalPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>السعر الأصلي (اختياري)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="مثال: ٣٠٠ ريال" data-testid="input-offer-original-price" />
                          </FormControl>
                          <FormDescription>يظهر مشطوباً</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="discountPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>السعر المخفض</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="مثال: ١٩٩ ريال" data-testid="input-offer-discount-price" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="badge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الشارة (اختياري)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="مثال: الأكثر طلباً" data-testid="input-offer-badge" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="badgeColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>لون الشارة</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-offer-badge-color">
                                <SelectValue placeholder="اختر لون" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {badgeColorOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="sortOrder"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ترتيب العرض</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              data-testid="input-offer-sort-order"
                            />
                          </FormControl>
                          <FormDescription>الأقل يظهر أولاً</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">تفعيل العرض</FormLabel>
                            <FormDescription>
                              إظهار العرض للعملاء
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="switch-offer-active"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                    >
                      إلغاء
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createMutation.isPending || updateMutation.isPending}
                      data-testid="button-save-offer"
                    >
                      {(createMutation.isPending || updateMutation.isPending) ? "جاري الحفظ..." : "حفظ"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Offers Grid */}
        {offersLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : offers && offers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <Card 
                key={offer.id} 
                className={`relative ${!offer.isActive ? "opacity-60" : ""}`}
                data-testid={`card-admin-offer-${offer.id}`}
              >
                {offer.badge && (
                  <div className="absolute -top-2 right-4 z-10">
                    <Badge 
                      variant={offer.badgeColor === "destructive" ? "destructive" : "default"}
                      className={offer.badgeColor === "amber" ? "bg-amber-500 text-white" : ""}
                    >
                      {offer.badge}
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getIconEmoji(offer.icon || "sparkles")}</span>
                      <div>
                        <CardTitle className="text-lg">{offer.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{offer.discountPrice}</p>
                      </div>
                    </div>
                    <Switch
                      checked={offer.isActive ?? true}
                      onCheckedChange={(checked) => 
                        toggleActiveMutation.mutate({ id: offer.id, isActive: checked })
                      }
                      data-testid={`switch-toggle-${offer.id}`}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 font-tajawal">
                    {offer.description}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 gap-1"
                      onClick={() => openEditDialog(offer)}
                      data-testid={`button-edit-${offer.id}`}
                    >
                      <Pencil className="w-4 h-4" />
                      <span>تعديل</span>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          data-testid={`button-delete-${offer.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>حذف العرض</AlertDialogTitle>
                          <AlertDialogDescription>
                            هل أنت متأكد من حذف "{offer.title}"؟ لا يمكن التراجع عن هذا الإجراء.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="gap-2">
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMutation.mutate(offer.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            حذف
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="max-w-md mx-auto">
            <CardContent className="p-12 text-center">
              <Tag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">لا توجد عروض</h3>
              <p className="text-muted-foreground font-tajawal mb-4">
                ابدأ بإضافة عرض جديد للعملاء
              </p>
              <Button onClick={openAddDialog} className="gap-2">
                <Plus className="w-4 h-4" />
                <span>إضافة عرض</span>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}

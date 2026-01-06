import Swal from "sweetalert2";
import type { SweetAlertOptions } from "sweetalert2";

export const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    // customClass: {
    //     popup: "!bg-main-300 !text-main-700 shadow-lg !rounded-full",
    //     title: "font-semibold text-sm",
    //     timerProgressBar: "bg-green-500",
    //     icon: "null",
    // },
    didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
} as SweetAlertOptions);

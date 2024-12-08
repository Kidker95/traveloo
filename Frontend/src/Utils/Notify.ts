import Swal from 'sweetalert2';
import { errorExtractor } from 'error-extractor';
import 'sweetalert2/dist/sweetalert2.min.css';

class Notify {
    public success(message: string) {
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: message,
            timer: 2500,
            showConfirmButton: false,
            position: 'top',
        });
    }

    public error(err: any) {
        const msg = errorExtractor.getMessage(err);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: msg,
            timer: 2500,
            showConfirmButton: false,
            position: 'top',
        });
    }

    public async confirm(
        message: string,
        confirmText: string = 'Yes',
        cancelText: string = 'No'
    ): Promise<boolean> {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: message,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: confirmText,
            cancelButtonText: cancelText,
            reverseButtons: true,
            position: 'top',
        });

        return result.isConfirmed;
    }
}

export const notify = new Notify();

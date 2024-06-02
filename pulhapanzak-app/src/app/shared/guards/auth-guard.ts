import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard {
    private _authService = inject(AuthService);
    private _router = inject(Router);

    async canActivate(): Promise<boolean> {
        const isUserLoggedIn = await this._authService.isUserLoggedIn();
        if (!isUserLoggedIn) {
            this._router.navigate(['/login']);
        }
        return isUserLoggedIn;
    }
}
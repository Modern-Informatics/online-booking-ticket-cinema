import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CitiesModule } from './cities/cities.module';
import { CinemasModule } from './cinemas/cinemas.module';
import { ScreensModule } from './screens/screens.module';
import { MoviesModule } from './movies/movies.module';
import { ShowsModule } from './shows/shows.module';
import { SeatsModule } from './seats/seats.module';
import { ShowSeatsModule } from './show-seats/show-seats.module';
import { BookingsModule } from './bookings/bookings.module';
import { BookingDetailsModule } from './booking-details/booking-details.module';
import { PaymentsModule } from './payments/payments.module';
import { PromotionsModule } from './promotions/promotions.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
// import { AuthMiddleware } from './auth/middleware/auth.middleware';

@Module({
  controllers: [AppController],
  providers: [AppService, JwtService],
  imports: [
    PrismaModule,
    CitiesModule,
    CinemasModule,
    ScreensModule,
    MoviesModule,
    ShowsModule,
    SeatsModule,
    ShowSeatsModule,
    BookingsModule,
    BookingDetailsModule,
    PaymentsModule,
    PromotionsModule,
    NotificationsModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}

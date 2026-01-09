import { GetDoctorAvailabileSlotUseCase } from "../../../applications/usecases/patient/AvailableSlot/GetDoctorAvailableSlot.UseCase";
import { Request, Response } from "express";
import { HttpStatusCode } from "../../../domain/constants/HttpStatusCode";
import { LockDoctorSlotUseCase } from "../../../applications/usecases/patient/BookingSlot/LockDoctorSlotUseCase";
import { UnLockDoctorSlotUseCase } from "../../../applications/usecases/patient/BookingSlot/UnLockDoctorSlot.useCase";
import { GetPatientBasicDetailsForCheckoutUseCase } from "../../../applications/usecases/patient/BookingSlot/getPatientBasicDetailsForCheckout.UseCase";
import { CheckoutUseCase } from "../../../applications/usecases/patient/BookingSlot/CheckoutUseCase";
import { HandleVerifyPayment } from "../../../applications/usecases/patient/BookingSlot/HandlePaymentWebhookUseCase";
import { ApponintmentSuccessOrFailureUseCase } from "../../../applications/usecases/patient/BookingSlot/ApponintmentSuccessOrFailure.useCase";

export class DoctorBookingController {
  constructor(
    private readonly _GetDoctorAvailabileSlotUseCase: GetDoctorAvailabileSlotUseCase,
    private readonly _lockDoctorSlotUseCase: LockDoctorSlotUseCase,
    private readonly _UnLockDoctorSlotUseCase: UnLockDoctorSlotUseCase,
    private readonly _GetPatientBasicDetailsForCheckoutUseCase: GetPatientBasicDetailsForCheckoutUseCase,
    private readonly _CheckoutUseCase: CheckoutUseCase,
    private readonly _HandleVerifyPayment: HandleVerifyPayment,
    private readonly _ApponintmentSuccessOrFailureUseCase: ApponintmentSuccessOrFailureUseCase
  ) {}

  GetAvailableSlots = async (req: Request, res: Response) => {
    const doctorId = req.query.id;
    const date = req.query.date;

    console.log(doctorId, date);

    if (!doctorId || !date) throw new Error("Invalid Request");

    const slots = await this._GetDoctorAvailabileSlotUseCase.execute(
      doctorId as string,
      date as string
    );
    res.status(HttpStatusCode.OK).json({
      success: true,
      data: slots,
    });
  };

  lockDoctorSlot = async (req: Request, res: Response) => {
    const { doctorId, date, startTime } = req.body;
    const userId = req.user?.userId as string;

    console.log(req.body, doctorId, date, startTime);

    const result = await this._lockDoctorSlotUseCase.execute({
      doctorId,
      date,
      startTime,
      userId,
    });

    if (!result.locked) {
      return res.status(409).json({
        success: false,
        message: "This slot was just taken by another patient",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Slot locked successfully",
      expiresIn: 500,
    });
  };

  unLockDoctorSlot = async (req: Request, res: Response) => {
    const { doctorId, date, startTime } = req.body;

    console.log(req.body, doctorId, date, startTime);

    await this._UnLockDoctorSlotUseCase.execute({
      doctorId,
      date,
      startTime,
    });

    return res.status(200).json({
      success: true,
      message: "Slot UNlocked successfully",
      expiresIn: 500,
    });
  };

  getPatientBasicDetailsForCheckout = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const doctorId = req.query.doctorId;

    if (!doctorId) throw new Error("Invalid request");

    const result = await this._GetPatientBasicDetailsForCheckoutUseCase.execute(
      userId as string,
      doctorId as string
    );

    console.log(result);
    res.status(HttpStatusCode.OK).json({
      success: true,
      data: result,
    });
  };

  checkout = async (req: Request, res: Response) => {
    const { doctorId, date, startTime, billingDetails } = req.body;
    const userId = req.user?.userId;

    console.log("userId", userId);
    const { firstName, lastName, phone, email, city, country, state, streetAddress, zipCode } =
      billingDetails;

    const result = await this._CheckoutUseCase.execute({
      doctorId,
      date,
      startTime,
      patientSnapshot: { firstName, lastName, phone, email },
      addressSnapshot: { city, country, state, street: streetAddress, zip: zipCode },
      patientId: userId as string,
    });

    console.log(result);

    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: result, message: "appoinment is created and " });
  };

  verifyPayment = async (req: Request, res: Response) => {
    const { appointmentId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !appointmentId) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification fields",
      });
    }

    await this._HandleVerifyPayment.execute({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      appointmentId,
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  };

  apponitmentSuccess = async (req: Request, res: Response) => {
    const id = req.params.id;

    console.log("The appoinemtent id ", id);

    const result = await this._ApponintmentSuccessOrFailureUseCase.execute(id);

    return res.status(200).json({
      success: true,
      data: result,
    });
  };
}

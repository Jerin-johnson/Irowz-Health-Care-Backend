import { Request, Response } from "express";
import { HttpStatusCode } from "../../../domain/constants/HttpStatusCode";
import { ILockDoctorSlotUseCase } from "../../../domain/usecase/patient/BookingSlots/ILockDoctorSlotUseCase";
import { IUnLockDoctorSlotUseCase } from "../../../domain/usecase/patient/BookingSlots/IUnLockDoctorSlotUseCase";
import { IGetPatientBasicDetailsForCheckoutUseCase } from "../../../domain/usecase/patient/BookingSlots/IGetPatientBasicDetailsForCheckoutUseCase";
import { ICheckoutUseCase } from "../../../domain/usecase/patient/BookingSlots/ICheckoutUseCase";
import { IHandleVerifyPayment } from "../../../domain/usecase/patient/BookingSlots/IHandleVerifyPayment";
import { IGetDoctorAvailableSlotUseCase } from "../../../domain/usecase/patient/Availibility/IGetDoctorAvailabileSlotUseCase";
import { IAppointmentSuccessOrFailureUseCase } from "../../../domain/usecase/patient/BookingSlots/IAppointmentSuccessOrFailure";
import { ApiResponse } from "../../utils/common.response.model";
import { CommonMessages } from "../../constants/message/CommonMessages";
import { PatientMessages } from "../../constants/message/Patient.message";

export class DoctorBookingController {
  constructor(
    private readonly _GetDoctorAvailabileSlotUseCase: IGetDoctorAvailableSlotUseCase,
    private readonly _lockDoctorSlotUseCase: ILockDoctorSlotUseCase,
    private readonly _UnLockDoctorSlotUseCase: IUnLockDoctorSlotUseCase,
    private readonly _GetPatientBasicDetailsForCheckoutUseCase: IGetPatientBasicDetailsForCheckoutUseCase,
    private readonly _CheckoutUseCase: ICheckoutUseCase,
    private readonly _HandleVerifyPayment: IHandleVerifyPayment,
    private readonly _ApponintmentSuccessOrFailureUseCase: IAppointmentSuccessOrFailureUseCase
  ) {}

  GetAvailableSlots = async (req: Request, res: Response) => {
    const doctorId = req.query.id;
    const date = req.query.date;

    console.log(doctorId, date);

    if (!doctorId || !date) throw new Error(CommonMessages.INVALID_REQUEST);

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
      return res.status(HttpStatusCode.CONFLICT).json({
        success: false,
        message: PatientMessages.SLOT_TAKEN,
      });
    }

    return res.status(HttpStatusCode.OK).json({
      success: true,
      message: PatientMessages.SLOT_LOCKED,
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

    return res.status(HttpStatusCode.OK).json({
      success: true,
      message: PatientMessages.SLOT_UNLOCKED,
      expiresIn: 500,
    });
  };

  getPatientBasicDetailsForCheckout = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const doctorId = req.query.doctorId;

    if (!doctorId) throw new Error(CommonMessages.INVALID_REQUEST);

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
    const {
      doctorId,
      date,
      startTime,
      billingDetails,
      visitType,
      paymentMethod = "RAZORPAY",
    } = req.body;
    const userId = req.user?.userId;

    const { firstName, lastName, phone, email, city, country, state, streetAddress, zipCode } =
      billingDetails;

    const result = await this._CheckoutUseCase.execute({
      doctorId,
      date,
      startTime,
      patientSnapshot: { firstName, lastName, phone, email },
      addressSnapshot: { city, country, state, street: streetAddress, zip: zipCode },
      patientId: userId as string,
      visitType,
      paymentMethod,
    });

    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, data: result, message: PatientMessages.APPOINTMENT_CREATED });
  };

  verifyPayment = async (req: Request, res: Response) => {
    const { appointmentId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !appointmentId) {
      return ApiResponse.error(res, CommonMessages.FIELDS_MISSING, HttpStatusCode.BAD_REQUEST);
    }

    await this._HandleVerifyPayment.execute({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      appointmentId,
    });

    return res.status(HttpStatusCode.OK).json({
      success: true,
      message: PatientMessages.PAYMENT_VERIFIED,
    });
  };

  apponitmentSuccess = async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await this._ApponintmentSuccessOrFailureUseCase.execute(id);

    return res.status(HttpStatusCode.OK).json({
      success: true,
      data: result,
    });
  };
}

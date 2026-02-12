import { Request, Response } from "express";
import { HttpStatusCode } from "../../../domain/constants/HttpStatusCode";
import { ApiResponse } from "../../utils/common.response.model";
import dotenv from "dotenv";
import { IGetActivePlansForListingHospitalAdminUseCase } from "../../../domain/usecase/hosptialAdmin/subscription/IGetActivePlansForListingHospitalAdminUseCase";
import { ICreateSubscriptionOrderUseCase } from "../../../domain/usecase/hosptialAdmin/subscription/ICreateSubscriptionOrderUseCase";
import { IBuySubscriptionUseCase } from "../../../domain/usecase/hosptialAdmin/subscription/IBuySubscriptionUseCase";
dotenv.config();

export class HospitalADminSubscriptionController {
  constructor(
    private readonly _GetActivePlansForListingHospitalAdminUseCase: IGetActivePlansForListingHospitalAdminUseCase,
    private readonly _CreateSubscriptionOrderUseCase: ICreateSubscriptionOrderUseCase,
    private readonly _BuySubscriptionUseCase: IBuySubscriptionUseCase
  ) {}

  GetSubcriptionPlans = async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const data = await this._GetActivePlansForListingHospitalAdminUseCase.execute(userId as string);

    return ApiResponse.success(res, data, "fetched successfully", HttpStatusCode.OK);
  };

  createOrder = async (req: Request, res: Response) => {
    const { planId } = req.body;
    const order = await this._CreateSubscriptionOrderUseCase.execute(planId);
    return ApiResponse.success(res, order, "Order created successfully", HttpStatusCode.CREATED);
  };

  confirmPayment = async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    const subscription = await this._BuySubscriptionUseCase.execute({
      hospitalId: userId as string,
      planId: req.body.planId,

      razorpayOrderId: req.body.razorpay_order_id,
      razorpayPaymentId: req.body.razorpay_payment_id,
      razorpaySignature: req.body.razorpay_signature,

      superAdminId: process.env.SUPER_ADMIN_ID!,
    });

    return ApiResponse.success(res, subscription);
  };
}

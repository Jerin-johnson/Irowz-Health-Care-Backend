import { Request, Response } from "express";
import { GetActivePlansForListingHospitalAdminUseCase } from "../../../applications/usecases/hospitalAdmin/subscription/GetSubscriptionPlans";
import { HttpStatusCode } from "../../../domain/constants/HttpStatusCode";
import { ApiResponse } from "../../utils/common.response.model";
import { CreateSubscriptionOrderUseCase } from "../../../applications/usecases/hospitalAdmin/subscription/CreateSubscriptionOrderUseCase";
import { BuySubscriptionUseCase } from "../../../applications/usecases/hospitalAdmin/subscription/BuySubscriptionUseCase";
import dotenv from "dotenv";
dotenv.config();

export class HospitalADminSubscriptionController {
  constructor(
    private readonly _GetActivePlansForListingHospitalAdminUseCase: GetActivePlansForListingHospitalAdminUseCase,
    private readonly _CreateSubscriptionOrderUseCase: CreateSubscriptionOrderUseCase,
    private readonly _BuySubscriptionUseCase: BuySubscriptionUseCase
  ) {}

  GetSubcriptionPlans = async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const data = await this._GetActivePlansForListingHospitalAdminUseCase.execute(userId as string);

    return ApiResponse.success(res, data, "fetched successfully", HttpStatusCode.OK);
  };

  createOrder = async (req: Request, res: Response) => {
    const { planId } = req.body;

    console.log("hai heelo");

    const order = await this._CreateSubscriptionOrderUseCase.execute(planId);

    console.log("shgfsgb fgb");
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

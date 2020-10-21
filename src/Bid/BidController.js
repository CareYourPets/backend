import express from 'express';
import {body, validationResult} from 'express-validator';
import {PET_DELIVERY_MODE, BID_PAYMENT_MODE} from '../Utils/BidUtils';
import service from './BidService';
import {AuthRequired} from '../Utils/AuthUtils';

const app = express();

/**
 * TODO: Validate end_date - start_date >= 0 as backup
 */
app.post(
  '/create',
  AuthRequired,
  [
    body('petName').isString(),
    body('petOwnerEmail').isEmail(),
    body('careTakerEmail').isEmail(),
    body('startDate').isDate(),
    body('endDate').isDate(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()});
    }
    try {
      const response = await service.BidCreate(req.body);
      return res.json(response);
    } catch (error) {
      return res.status(403).json({error});
    }
  },
);

app.get('/info', AuthRequired, async (req, res) => {
  try {
    const response = await service.BidsInfo({
      ...req.user,
    });
    return res.json({response});
  } catch (error) {
    return res.status(403).json({error});
  }
});

app.post('/delete', AuthRequired, async (req, res) => {
  const response = await service.BidDelete(req.bid);
  return res.json(response);
});

/**
 * Endpoint to update all fields, including reviews and transaction data.
 */
app.post(
  '/update',
  [
    body('isAccepted').isBoolean(),
    body('transactionDate').isDate(),
    body('paymentMode').isIn([BID_PAYMENT_MODE.CASH, BID_PAYMENT_MODE.CREDIT]),
    body('amount').isFloat(),
    body('reviewDate').isDate(),
    body('transportationMode').isIn([
      PET_DELIVERY_MODE.CARE_TAKER_PICK_UP,
      PET_DELIVERY_MODE.PET_OWNER_DELIVER,
      PET_DELIVERY_MODE.TRANSFER_THROUGH_PCS,
    ]),
    body('review').isString(),
    // validate PK
    body('petName').isString(),
    body('petOwnerEmail').isEmail(),
    body('careTakerEmail').isEmail(),
    body('startDate').isDate(),
  ],
  AuthRequired,
  async (req, res) => {
    try {
      const response = await service.BidUpdate({
        ...req.body,
      });
      return res.json(response);
    } catch (error) {
      return res.status(403).json({error});
    }
  },
);

export default {
  app,
};

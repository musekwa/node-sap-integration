import sapB1Service from "../services/sapB1.service.js";

export const getCustomers = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 50,
            search,
        } = req.query;
        const skip = (page - 1) * limit;
        const options = {
            select: ["CardCode", "CardName",  "Currency", "Phone1", "EmailAddress"],
            filter: "CardType eq 'cCustomer'",
            skip: parseInt(skip),
            top: parseInt(limit),
            orderby: "CardName",
        }

        if (search) {
            options.filter += ` and contains(CardName, '${search}')`;
        }

        const result = await sapB1Service.getBusinessPartners(options);

        res.status(200).json({
            success: true,
            data: result.value,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: result['odata.count'] || result.value.length,
            }
        });
    } catch (error) {
        next(error);
    }
}


export const getCustomer = async (req, res, next) => {
    try {
        const { cardCode } = req.params;
        const result = await sapB1Service.getBusinessPartner(cardCode);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export const createCustomer = async (req, res, next) => {
    try {
        const customerData = {
            CardCode: req.body.cardCode,
            CardName: req.body.cardName,
            CardType: 'cCustomer',
            Currency: req.body.currency || 'MZN',
            Phone1: req.body.phone,
            EmailAddress: req.body.email,
            ...req.body,
        }
        const result = await sapB1Service.createBusinessPartner(customerData);
        res.status(200).json({ success: true, 
            data: result,
            message: 'Customer created successfully' });
    } catch (error) {
        next(error);
    }
}

export const updateCustomer = async (req, res, next) => {
    try {
        const { cardCode } = req.params;
        const result = await sapB1Service.updateBusinessPartner(cardCode, req.body);
        res.status(200).json({ success: true, data: result, message: 'Customer updated successfully' });
    } catch (error) {
        next(error);
    }
}

export const deleteCustomer = async (req, res, next) => {
    try {
        const { cardCode } = req.params;
        const result = await sapB1Service.deleteBusinessPartner(cardCode);
        res.status(200).json({ success: true, data: result, message: 'Customer deleted successfully' });
    } catch (error) {
        next(error);
    }
}

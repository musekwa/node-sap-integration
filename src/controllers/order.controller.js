export const getOrders = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 50,
            status,
            customer,
        } = req.query;
        const skip = (page - 1) * limit;
        const options = {
            select: ["DocEntry", "DocNum", "CardCode", "CardName", "DocDate", "DocTotal", "DocumentStatus"],
            skip: parseInt(skip),
            top: parseInt(limit),
            orderby: "DocDate desc",
        }

        let filters = [];
        if (status) {
            filters.push(`DocumentStatus eq 'bost_${status}'`);
        }
        if (customer) {
            filters.push(`CardCode eq '${customer}'`);
        }
        if (filters.length > 0) {
            options.filter = filters.join(' and ');
        }

        const result = await sapB1Service.getOrders(options);
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


export const getOrder = async (req, res, next) => {
    try {
      const { docEntry } = req.params;
      const order = await sapB1Service.getOrder(docEntry);
  
      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      next(error);
    }
  };
export const createOrder = async (req, res, next) => {
    try {
      const orderData = {
        CardCode: req.body.cardCode,
        DocDate: req.body.docDate || new Date().toISOString().split('T')[0],
        DocDueDate: req.body.docDueDate,
        Comments: req.body.comments,
        DocumentLines: req.body.documentLines
      };
  
      const result = await sapB1Service.createOrder(orderData);
  
      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };
  

export const updateOrder = async (req, res, next) => {
    try {
        const { docEntry } = req.params;
        const result = await sapB1Service.updateOrder(docEntry, req.body);
        res.status(200).json({ success: true, data: result, message: 'Order updated successfully' });
    } catch (error) {
        next(error);
    }
}

export const cancelOrder = async (req, res, next) => {
    try {
        const { docEntry } = req.params;
        const result = await sapB1Service.cancelOrder(docEntry);
        res.status(200).json({ success: true, data: result, message: 'Order cancelled successfully' });
    } catch (error) {
        next(error);
    }
}

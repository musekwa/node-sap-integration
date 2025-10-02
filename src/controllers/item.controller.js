export const getItems = async (req, res, next) => {
    const {
        page = 1,
        limit = 50,
        search,
        inStock,
    } = req.query;
    const skip = (page - 1) * limit;
    const options = {
        select: ["ItemCode", "ItemName", "QuantityOnStock", "Price", "Currency"],
        skip: parseInt(skip),
        top: parseInt(limit),
        orderby: "ItemName",
    }
    let filters = [];
    if (search) {
        filters.push(`contains(ItemName, '${search}')`);
    }
    
    if (inStock === 'true') {
        filters.push(`QuantityOnStock gt 0`);
    }
    if (filters.length > 0) {
        options.filter = filters.join(' and ');
    }

    const result = await sapB1Service.getItems(options);

    res.status(200).json({
        success: true,
        data: result.value,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: result['odata.count'] || result.value.length,
        }
    });
}
    

export const getItem = async (req, res, next) => {
    try {
    const { itemCode } = req.params;
    const result = await sapB1Service.getItem(itemCode);
    res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export const createItem = async (req, res, next) => {
    try {
        const itemData = {
            ItemCode: req.body.itemCode,
            ItemName: req.body.itemName,
            itemType: req.body.itemType || 'iItem',
            ...req.body,
        }
        const result = await sapB1Service.createItem(itemData);
        res.status(200).json({ success: true, data: result, message: 'Item created successfully' });
    } catch (error) {
        next(error);
    }
}

export const updateItem = async (req, res, next) => {
    try {
        const { itemCode } = req.params;
        const result = await sapB1Service.updateItem(itemCode, req.body);
        res.status(200).json({ success: true, data: result, message: 'Item updated successfully' });
    } catch (error) {
        next(error);
    }
}
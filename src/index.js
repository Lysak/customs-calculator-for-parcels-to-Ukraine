$(function () {

    var airDeliveryType = $("#tariff");
    var airTotalCost = $("#total-cost");
    var airShipmentCost = $("#shipment-cost");
    var airParcelWeight = $("#weight");
    var airTotalCostUa = $("#total-cost-ua");
    var airCustomsCos = $("#customs-cost");
    var airParcelDeclaredCost = $("#price");
    var airAddServices = $("#add-services");

    var seaDeliveryType = $("#sea-tariff");
    var seaWeight = $("#sea-weight");
    var seaParcelCost = $("#sea-price");
    var seaTotalCost = $("#sea-total-cost");
    var seaShipmentCost = $("#sea-shipment-cost");
    var seaTotalCostUa = $("#sea-total-cost-ua");
    var seaAddServices = $("#sea-add-services");
    var seaCustomsCos = $("#sea-customs-cost");


    var shopDeliveryType = $("#shop-tariff");
    var shopWeight = $("#shop-weight");
    var shopParcelCost = $("#shop-price");
    var shopTotalCost = $("#shop-total-cost");
    var shopShipmentCost = $("#shop-shipment-cost");
    var shopTotalCostUa = $("#shop-total-cost-ua");
    var shopAddServices = $("#shop-add-services");
    var shopCustomsCos = $("#shop-customs-cost");
    var shopCommission = $("#shop-commission");

    var rate = Number($("input#current-rate").val());
    var min_weight = 0.3;
    var customsLimit = 110;
    var shopPercent = 0.12;
    var parcelWeightConst = 4.990;

    var inputValidator = function (obj) {
        var row = $(obj).closest('.form-group');
        var value = parseFloatWithComa($(obj).val());
        row.removeClass('has-error');
        if (value === undefined) {
            row.addClass('has-error');
        }
    };

    var setShipmentCost = function (number, shippingType) {
        var element = 0;

        if (shippingType == 'sea') {
            var element = seaShipmentCost;
        }
        if (shippingType == 'shop') {
            var element = shopShipmentCost;
        }
        if (shippingType == 'air') {
            var element = airShipmentCost;
        }


        if (!isNaN(number) && number !== undefined && number != 0) {
            element.html(number);
            return;
        }
        element.html(0);
    };

    var setServicesCost = function (number, shippingType) {

        var element = 0;

        if (shippingType == 'sea') {
            var element = seaAddServices;
        }

        if (shippingType == 'shop') {
            var element = shopAddServices;
        }
        if (shippingType == 'air') {
            var element = airAddServices;
        }

        if (!isNaN(number) && number !== undefined && number != 0) {
            element.html(number);
            return;
        }
        element.html(0);
    };

    var setCustomsCost = function (number, shippingType) {

        var element = 0;

        if (shippingType == 'sea') {
            var element = seaCustomsCos;
        }

        if (shippingType == 'shop') {
            var element = shopCustomsCos;
        }

        if (shippingType == 'air') {
            var element = airCustomsCos;
        }

        if (!isNaN(number) && number !== undefined && number != 0) {
            element.html(number);
            return;
        }
        element.html(0);
    };

    var setCommission = function (number) {

        var element = shopCommission;

        if (!isNaN(number) && number !== undefined && number != 0) {
            element.html(number);
            return;
        }
        element.html(0);
    }

    var getWeight = function (shippingType) {
        var weight = 0;
        if (shippingType == 'sea') {
            weight = seaWeight.val();
        }
        if (shippingType == 'shop') {
            weight = shopWeight.val();
        }
        if (shippingType == 'air') {
            weight = airParcelWeight.val();
        }

        var weightResult = parseFloatWithComa(weight);
        if (weightResult < min_weight) weightResult = min_weight;
        return weightResult;
    };

    var getDeliveryTypeCost = function (shippingType) {
        var deliveryTypeCost = 0;
        if (shippingType == 'sea') {
            deliveryTypeCost = seaDeliveryType.val() / 100;
        }
        if (shippingType == 'shop') {
            deliveryTypeCost = shopDeliveryType.val() / 100;
        }
        if (shippingType == 'air') {
            deliveryTypeCost = airDeliveryType.val() / 100;
        }

        return deliveryTypeCost;
    }

    var getCost = function (shippingType) {
        var parcelCost = 0;
        if (isEmpty(parcelCost)) {
            parcelCost = 0;
        }

        if (shippingType == 'shop') {
            parcelCost = shopParcelCost.val();
            if (isEmpty(parcelCost)) {
                parcelCost = 0;
            }
        }
        if (shippingType == 'sea') {
            parcelCost = seaParcelCost.val();
            if (isEmpty(parcelCost)) {
                parcelCost = 0;
            }
        }
        if (shippingType == 'air') {
            parcelCost = airParcelDeclaredCost.val();
            if (isEmpty(parcelCost)) {
                parcelCost = 0;
            }
        }

        return parseFloatWithComa(parcelCost);
    };

    var getCustomsCost = function (cost) {
        var customLimit1 = 130.90; //100 E
        var customLimit2 = 178.49; //150 E
        var customPercent1 = 0.2;
        var customPercent2 = 0.1;

        var customTax = 0;
        if (cost != undefined) {
            if (cost > customLimit1 && cost <= customLimit2) {
                customTax = roundNumber((cost - customLimit1) * customPercent1, 2);
            }
            ;
            if (cost > customLimit2) {
                var p1 = (cost - customLimit2) * customPercent2;
                var p2 = (cost - customLimit1 + p1) * customPercent1;
                customTax = roundNumber(p1 + p2, 2);
            }
            ;
        }

        return customTax;
    };

    var getServicesCost = function (shippingType, parcelCost) {
        var cost = 0;
        if (isEmpty(parcelCost)) {
            parcelCost = 0;
        }

        if (shippingType == 'air') {
            $('.air-checkboxes-holder :checked').each(function () {
                if ($('#secure').is(':checked') && ($(this).val()) === "0.0299") {
                    cost += parseFloatWithComa(($(this).val())) * parcelCost;
                } else {
                    var addServices = parseFloatWithComa(($(this).val()));
                    if (addServices > 0) cost += addServices;
                }
            });
        }


        if (shippingType == 'shop') {

            $('.shop-checkboxes-holder :checked').each(function () {
                if ($('#shop-secure').is(':checked') && ($(this).val()) === "0.0299") {
                    cost += parseFloatWithComa(($(this).val())) * parcelCost;
                } else {
                    var addServices = parseFloatWithComa(($(this).val()));
                    if (addServices > 0) cost += addServices;
                }
            });
        }

        if (shippingType == 'sea') {

            $('.sea-checkboxes-holder :checked').each(function () {
                if ($('#sea-secure').is(':checked') && ($(this).val()) === "0.0299") {
                    cost += parseFloatWithComa(($(this).val())) * parcelCost;
                } else {
                    var addServices = parseFloatWithComa(($(this).val()));
                    if (addServices > 0) cost += addServices;
                }
            });

        }
        return Number(cost);
    };

    var setOverallCost = function (number, shippingType) {
        var roundNumber = Number(number).toFixed(2);
        var roundSecondNumber = Number(number * rate).toFixed(2);

        var element = 0;
        var elementUa = 0;

        if (shippingType == 'shop') {
            var element = shopTotalCost;
            var elementUa = shopTotalCostUa;
        }

        if (shippingType == 'sea') {
            var element = seaTotalCost;
            var elementUa = seaTotalCostUa;
        }

        if (shippingType == 'air') {
            var element = airTotalCost;
            var elementUa = airTotalCostUa;
        }

        if (!isNaN(roundNumber) && roundNumber !== undefined && number != 0) {
            element.html(roundNumber);
            elementUa.html(roundSecondNumber);
            return;
        }
        element.html(0);
        elementUa.html(0);
    };

    var calculateCost = function (shippingType) {
        var weight = getWeight(shippingType);
        var deliveryTypeCost = getDeliveryTypeCost(shippingType);
        var cost = getCost(shippingType);
        var customsCost = getCustomsCost(cost);
        var servicesCost = getServicesCost(shippingType, cost);
        var shopPercentPrice = 0;
        var shipmentCostWeight = 0;
        var minimumCommission = 3;

        shipmentCostWeight = Math.ceil(deliveryTypeCost * weight * 100) / 100;

        if (deliveryTypeCost == 17.50) {
            if (weight * parcelWeightConst < deliveryTypeCost) {
                shipmentCostWeight = deliveryTypeCost;
            } else {
                shipmentCostWeight = weight * parcelWeightConst;
            }
        }

        var shipmentCost = shipmentCostWeight;

        if (shippingType == 'shop') {
            let sum = shopPercent * cost;
            shopPercentPrice = sum < minimumCommission ? minimumCommission : sum;
        }

        setShipmentCost(Number(shipmentCost).toFixed(2), shippingType);
        setServicesCost(Number(servicesCost).toFixed(2), shippingType);
        setCustomsCost(Number(customsCost).toFixed(2), shippingType);
        setCommission(Number(shopPercentPrice).toFixed(2));
        setOverallCost(customsCost + shipmentCost + shopPercentPrice + servicesCost, shippingType);
    };

    shopDeliveryType.change(function () {
        inputValidator(this);
        calculateCost('shop');
    });

    shopWeight.keyup(function () {
        inputValidator(this);
        calculateCost('shop');
    });

    shopParcelCost.keyup(function () {
        inputValidator(this);
        calculateCost('shop');
    });

    $('.shop-checkboxes-holder').change(function () {
        inputValidator(this);
        calculateCost('shop');
    });

    seaDeliveryType.change(function () {
        inputValidator(this);
        calculateCost('sea');
    });

    seaWeight.keyup(function () {
        inputValidator(this);
        calculateCost('sea');
    });

    seaParcelCost.keyup(function () {
        inputValidator(this);
        calculateCost('sea');
    });

    $('.sea-checkboxes-holder').change(function () {
        inputValidator(this);
        calculateCost('sea');
    });

    airDeliveryType.change(function () {
        inputValidator(this);
        calculateCost('air');
    });

    airParcelWeight.keyup(function () {
        inputValidator(this);
        calculateCost('air');
    });

    airParcelDeclaredCost.keyup(function () {
        inputValidator(this);
        calculateCost('air');
    });

    $('.air-checkboxes-holder').change(function () {
        inputValidator(this);
        calculateCost('air');
    });

    $(document).on('click', '.checkboxes-holder .show-links', function () {
        const _parent = $(this).closest('.checkboxes-holder');
        if ($(_parent).hasClass('open')) {
            $(_parent).removeClass('open');
        } else {
            $(_parent).addClass('open');
        }
    });

    function parseFloatWithComa(valueToParse) {
        var valueToReplace = String(valueToParse);
        if (valueToReplace) {
            var value = valueToReplace.replace(',', '.');

            if (/^\d+(\.\d+)?$/.test(value)) {
                return Number(value);
            }
        }
        return undefined;
    }

    function isEmpty(str) {
        return (!str || 0 === str.length);
    }

    function roundNumber(number, precision) {
        var factor = Math.pow(10, precision);
        var tempNumber = number * factor;
        var roundedTempNumber = Math.round(tempNumber);
        return roundedTempNumber / factor;
    }

});
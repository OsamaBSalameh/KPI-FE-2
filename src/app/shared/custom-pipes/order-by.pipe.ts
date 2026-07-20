import { Pipe, PipeTransform } from "@angular/core";
import { UnitKPIValue } from "src/app/modules/kpi/entities/classes/unit-kpi-value";

@Pipe({
    name: "orderBy",
})
export class OrderByQuarterOrderPipe implements PipeTransform {
    transform(value: UnitKPIValue[] | undefined, order: "asc" | "desc" = "asc"): UnitKPIValue[] | undefined {
        return value?.sort((a, b) => {
            if (a.order != undefined && b.order != undefined)
                if (order === "asc")
                    return a?.order - b?.order;
                else if (order === "desc")
                    return b?.order - a?.order;
            return 0;
        });
    }
}
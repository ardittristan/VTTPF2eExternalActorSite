export class ConditionManager {
  static getFlattenedConditions(items) {
    const conditions = new Map();

    items
      .sort((a, b) => ConditionManager.__sortCondition(a, b))
      .forEach((c) => {
        // Sorted list of conditions.
        // First by active, then by base (lexicographically), then by value (descending).

        let name = `${c.data.base}`;
        let condition;

        if (c.data.value.isValued) {
          name = `${name} ${c.data.value.value}`;
        }

        if (conditions.has(name)) {
          // Have already seen condition
          condition = conditions.get(name);
        } else {
          // Have not seen condition
          condition = {
            id: c._id,
            active: c.data.active,
            name: name, // eslint-disable-line object-shorthand
            value: c.data.value.isValued ? c.data.value.value : undefined,
            description: c.data.description.value,
            img: c.img,
            references: false,
            parents: [],
            children: [],
            overrides: [],
            overriddenBy: [],
            immunityFrom: [],
          };

          conditions.set(name, condition);
        }

        // Update any references
        if (c.data.references.parent) {
          const refCondition = items.find((i) => i._id === c.data.references.parent.id);

          if (refCondition) {
            const ref = {
              id: c.data.references.parent,
              name: refCondition.name,
              base: refCondition.data.base,
              text: "",
            };

            if (refCondition.data.value.isValued) {
              ref.name = `${ref.name} ${refCondition.data.value.value}`;
            }

            ref.text = `@Compendium[pf2e.conditionitems.${refCondition.data.base}]{${ref.name}}`;

            condition.references = true;
            condition.parents.push(ref);
          }
        }

        c.data.references.children.forEach((item) => {
          const refCondition = items.find((i) => i._id === item.id);

          if (refCondition) {
            const ref = {
              id: c.data.references.parent,
              name: refCondition.name,
              base: refCondition.data.base,
              text: "",
            };

            if (refCondition.data.value.isValued) {
              ref.name = `${ref.name} ${refCondition.data.value.value}`;
            }

            ref.text = `@Compendium[pf2e.conditionitems.${refCondition.data.base}]{${ref.name}}`;

            condition.references = true;
            condition.children.push(ref);
          }
        });

        c.data.references.overrides.forEach((item) => {
          const refCondition = items.find((i) => i._id === item.id);

          if (refCondition) {
            const ref = {
              id: c.data.references.parent,
              name: refCondition.name,
              base: refCondition.data.base,
              text: "",
            };

            if (refCondition.data.value.isValued) {
              ref.name = `${ref.name} ${refCondition.data.value.value}`;
            }

            ref.text = `@Compendium[pf2e.conditionitems.${refCondition.data.base}]{${ref.name}}`;

            condition.references = true;
            condition.overrides.push(ref);
          }
        });

        c.data.references.overriddenBy.forEach((item) => {
          const refCondition = items.find((i) => i._id === item.id);

          if (refCondition) {
            const ref = {
              id: c.data.references.parent,
              name: refCondition.name,
              base: refCondition.data.base,
              text: "",
            };

            if (refCondition.data.value.isValued) {
              ref.name = `${ref.name} ${refCondition.data.value.value}`;
            }

            ref.text = `@Compendium[pf2e.conditionitems.${refCondition.data.base}]{${ref.name}}`;

            condition.references = true;
            condition.overriddenBy.push(ref);
          }
        });

        c.data.references.immunityFrom.forEach((item) => {
          const refCondition = items.find((i) => i._id === item.id);

          if (refCondition) {
            const ref = {
              id: c.data.references.parent,
              name: refCondition.name,
              base: refCondition.data.base,
              text: "",
            };

            if (refCondition.data.value.isValued) {
              ref.name = `${ref.name} ${refCondition.data.value.value}`;
            }

            ref.text = `@Compendium[pf2e.conditionitems.${refCondition.data.base}]{${ref.name}}`;

            condition.references = true;
            condition.immunityFrom.push(ref);
          }
        });
      });

    return Array.from(conditions.values());
  }

  static __sortCondition(a, b) {
    if (a.data.active === b.data.active) {
      // Both are active or both inactive.

      if (a.data.base === b.data.base) {
        // Both are same base

        if (a.data.value.isValued) {
          // Valued condition
          // Sort values by descending order.
          return b.data.value.value - a.data.value.value;
        } else {
          // Not valued condition
          return 0;
        }
      } else {
        // Different bases
        return a.data.base.localeCompare(b.data.base);
      }
    } else if (a.data.active && !b.data.active) {
      // A is active, B is not
      // A should be before B.
      return -1;
    } else if (!a.data.active && b.data.active) {
      // B is active, A is not
      // Be should be before A.
      return 1;
    }

    return 0;
  }
}

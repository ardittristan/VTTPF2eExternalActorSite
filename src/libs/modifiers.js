const PF2ModifierType = Object.freeze({
  ABILITY: "ability",
  PROFICIENCY: "proficiency",
  CIRCUMSTANCE: "circumstance",
  ITEM: "item",
  STATUS: "status",
  UNTYPED: "untyped",
});

class PF2Modifier {
  name;

  modifier;

  type;

  enabled;

  source;

  notes;

  ignored;

  custom;

  damageType;

  predicate;

  critical;

  traits;

  /**
   * Create a new modifier.
   * @param {string} name The name for the modifier; should generally be a localization key.
   * @param {number} modifier The actual numeric benefit/penalty that this modifier provides.
   * @param {string} type The type of the modifier - modifiers of the same type do not stack (except for `untyped` modifiers).
   * @param {boolean} enabled If true, this modifier will be applied to the result; otherwise, it will not.
   * @param {string} source The source which this modifier originates from, if any.
   * @param {string} notes Any notes about this modifier.
   */
  constructor(name, modifier, type, enabled = true, source = undefined, notes = undefined) {
    this.name = name;
    this.modifier = modifier;
    this.type = type;
    this.enabled = enabled;
    this.ignored = false;
    this.custom = false;
    if (source) this.source = source;
    if (notes) this.notes = notes;
  }
}

let UNTRAINED = {};
let TRAINED = {};
let EXPERT = {};
let MASTER = {};
let LEGENDARY = {};

export function initModifiers(actorData) {
  UNTRAINED = {
    atLevel: (level) => {
      const modifier = actorData.flags?.externalactor?.proficiencyUntrainedModifier ?? 0;
      return new PF2Modifier("PF2E.ProficiencyLevel0", modifier, PF2ModifierType.PROFICIENCY);
    },
  };

  TRAINED = {
    atLevel: (level) => {
      const rule = actorData.flags?.externalactor?.proficiencyVariant ?? "ProficiencyWithLevel";
      let modifier = actorData.flags?.externalactor?.proficiencyTrainedModifier ?? 2;
      if (rule === "ProficiencyWithLevel") {
        modifier += level;
      }
      return new PF2Modifier("PF2E.ProficiencyLevel1", modifier, PF2ModifierType.PROFICIENCY);
    },
  };

  EXPERT = {
    atLevel: (level) => {
      const rule = actorData.flags?.externalactor?.proficiencyVariant ?? "ProficiencyWithLevel";
      let modifier = actorData.flags?.externalactor?.proficiencyExpertModifier ?? 4;
      if (rule === "ProficiencyWithLevel") {
        modifier += level;
      }
      return new PF2Modifier("PF2E.ProficiencyLevel2", modifier, PF2ModifierType.PROFICIENCY);
    },
  };

  MASTER = {
    atLevel: (level) => {
      const rule = actorData.flags?.externalactor?.proficiencyVariant ?? "ProficiencyWithLevel";
      let modifier = actorData.flags?.externalactor?.proficiencyMasterModifier ?? 6;
      if (rule === "ProficiencyWithLevel") {
        modifier += level;
      }
      return new PF2Modifier("PF2E.ProficiencyLevel3", modifier, PF2ModifierType.PROFICIENCY);
    },
  };

  LEGENDARY = {
    atLevel: (level) => {
      const rule = actorData.flags?.externalactor?.proficiencyVariant ?? "ProficiencyWithLevel";
      let modifier = actorData.flags?.externalactor?.proficiencyLegendaryModifier ?? 8;
      if (rule === "ProficiencyWithLevel") {
        modifier += level;
      }
      return new PF2Modifier("PF2E.ProficiencyLevel4", modifier, PF2ModifierType.PROFICIENCY);
    },
  };
}

export const ProficiencyModifier = Object.freeze({
  fromLevelAndRank: (level, rank) => {
    switch (rank || 0) {
      case 0:
        return UNTRAINED.atLevel(level);
      case 1:
        return TRAINED.atLevel(level);
      case 2:
        return EXPERT.atLevel(level);
      case 3:
        return MASTER.atLevel(level);
      case 4:
        return LEGENDARY.atLevel(level);
      default:
        throw new RangeError(`invalid proficiency rank: ${rank}`);
    }
  },
});

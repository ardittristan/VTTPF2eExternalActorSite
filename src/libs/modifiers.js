const PF2ModifierType = Object.freeze({
  ABILITY: 'ability',
  PROFICIENCY: 'proficiency',
  CIRCUMSTANCE: 'circumstance',
  ITEM: 'item',
  STATUS: 'status',
  UNTYPED: 'untyped',
});

class PF2Modifier {
  /** The name of this modifier; should generally be a localization key (see en.json). */
  name;
  /** The actual numeric benefit/penalty that this modifier provides. */
  modifier;
  /** The type of this modifier - modifiers of the same type do not stack (except for `untyped` modifiers). */
  type;
  /** If true, this modifier will be applied to the final roll; if false, it will be ignored. */
  enabled;
  /** The source which this modifier originates from, if any. */
  source;
  /** Any notes about this modifier. */
  notes;
  /** If true, this modifier should be explicitly ignored in calculation; it is usually set by user action. */
  ignored;
  /** If true, this modifier is a custom player-provided modifier. */
  custom;
  /** The damage type that this modifier does, if it modifies a damage roll. */
  damageType;
  /** A predicate which determines when this modifier is active. */
  predicate;
  /** If true, this modifier is only active on a critical hit. */
  critical;
  /** The list of traits that this modifier gives to the underlying attack, if any. */
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




const UNTRAINED = Object.freeze({
  atLevel: (level) => {
    const modifier = /* game.settings.get('pf2e', 'proficiencyUntrainedModifier') ?? */ 0;
    return new PF2Modifier('PF2E.ProficiencyLevel0', modifier, PF2ModifierType.PROFICIENCY);
  },
});
const TRAINED = Object.freeze({
  atLevel: (level) => {
    const rule = /* game.settings.get('pf2e', 'proficiencyVariant') ?? */ 'ProficiencyWithLevel';
    let modifier = /* game.settings.get('pf2e', 'proficiencyTrainedModifier') ?? */ 2;
    if (rule === 'ProficiencyWithLevel') {
      modifier += level;
    }
    return new PF2Modifier('PF2E.ProficiencyLevel1', modifier, PF2ModifierType.PROFICIENCY);
  },
});
const EXPERT = Object.freeze({
  atLevel: (level) => {
    const rule = /* game.settings.get('pf2e', 'proficiencyVariant') ?? */ 'ProficiencyWithLevel';
    let modifier = /* game.settings.get('pf2e', 'proficiencyExpertModifier') ?? */ 4;
    if (rule === 'ProficiencyWithLevel') {
      modifier += level;
    }
    return new PF2Modifier('PF2E.ProficiencyLevel2', modifier, PF2ModifierType.PROFICIENCY);
  },
});
const MASTER = Object.freeze({
  atLevel: (level) => {
    const rule = /* game.settings.get('pf2e', 'proficiencyVariant') ?? */ 'ProficiencyWithLevel';
    let modifier = /* game.settings.get('pf2e', 'proficiencyMasterModifier') ?? */ 6;
    if (rule === 'ProficiencyWithLevel') {
      modifier += level;
    }
    return new PF2Modifier('PF2E.ProficiencyLevel3', modifier, PF2ModifierType.PROFICIENCY);
  },
});
const LEGENDARY = Object.freeze({
  atLevel: (level) => {
    const rule = /* game.settings.get('pf2e', 'proficiencyVariant') ?? */ 'ProficiencyWithLevel';
    let modifier = /* game.settings.get('pf2e', 'proficiencyLegendaryModifier') ?? */ 8;
    if (rule === 'ProficiencyWithLevel') {
      modifier += level;
    }
    return new PF2Modifier('PF2E.ProficiencyLevel4', modifier, PF2ModifierType.PROFICIENCY);
  },
});


export const ProficiencyModifier = Object.freeze({
  fromLevelAndRank: (level, rank) => {
    switch (rank || 0) {
      case 0: return UNTRAINED.atLevel(level);
      case 1: return TRAINED.atLevel(level);
      case 2: return EXPERT.atLevel(level);
      case 3: return MASTER.atLevel(level);
      case 4: return LEGENDARY.atLevel(level);
      default: throw new RangeError(`invalid proficiency rank: ${rank}`);
    }
  }
});

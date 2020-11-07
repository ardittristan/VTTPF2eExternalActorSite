import localize from "../handlebars/helpers/stringify"
import {ProficiencyModifier} from "./modifiers"

export const ChatData = {
  armorChatData(item) {
    const data = JSON.parse(JSON.stringify(item.data));
    const properties = [
      PF2E.armorTypes[data.armorType.value],
      PF2E.armorGroups[data.group.value],
      `${addSign(getArmorBonus(data))} ${localize('PF2E.ArmorArmorLabel')}`,
      `${data.dex.value || 0} ${localize('PF2E.ArmorDexLabel')}`,
      `${data.check.value || 0} ${localize('PF2E.ArmorCheckLabel')}`,
      `${data.speed.value || 0} ${localize('PF2E.ArmorSpeedLabel')}`,
      data.traits.value,
      data.equipped.value ? localize('PF2E.ArmorEquippedLabel') : null,
    ];
    data.properties = properties.filter((p) => p !== null);

    data.traits = null;
    return data;

  },

  /* -------------------------------------------- */

  equipmentChatData(item) {
    const data = JSON.parse(JSON.stringify(item.data));
    const properties = [
      data.equipped.value ? localize('PF2E.EquipmentEquippedLabel') : null,
    ];
    data.properties = properties.filter((p) => p !== null);
    return data;
  },

  /* -------------------------------------------- */

  weaponChatData(item, actorData) {
    const data = JSON.parse(JSON.stringify(item.data));
    actorData = actorData.data;
    const traits = [];
    const itemTraits = data.traits.value;
    let twohandedTrait = false;
    const twohandedRegex = '(\\btwo-hand\\b)-(d\\d+)';

    if (this.data.type !== 'weapon') {
      throw new Error('tried to create a weapon chat data for a non-weapon item');
    }

    if ((data.traits.value || []).length !== 0) {
      for (let i = 0; i < data.traits.value.length; i++) {
        const traitsObject = {
          label: PF2E.weaponTraits[data.traits.value[i]] || (data.traits.value[i].charAt(0).toUpperCase() + data.traits.value[i].slice(1)),
          description: PF2E.traitsDescriptions[data.traits.value[i]] || '',
        };
        traits.push(traitsObject);

        // Check if two-handed trait is present
        if (itemTraits[i].match(twohandedRegex)) {
          twohandedTrait = true;
        }
      }
    }

    // calculate attackRoll modifier (for _onItemSummary)
    const isFinesse = (data.traits.value || []).includes('finesse');
    const abl = (isFinesse && actorData.data.abilities.dex.mod > actorData.data.abilities.str.mod ? 'dex' : (data.ability.value || 'str'));

    const prof = data.weaponType.value || 'simple';
    // if a default martial proficiency then lookup the martial value, else find the martialSkill item and get the value from there.
    const proficiency = {
      type: "default",
      value: 0
    };
    if (Object.keys(PF2E.weaponTypes).includes(prof)) {
      proficiency.type = "martial";
      proficiency.value = (actorData.data).martial?.[prof]?.value || 0;
    } else {
      try {
        const martialSkill = actorData.items.find(item => item._id === prof);
        if (martialSkill.data.type === 'martial') {
          proficiency.type = "skill";
          const rank = martialSkill.data.data.proficient?.value || 0;
          proficiency.value = ProficiencyModifier.fromLevelAndRank(this.actor.data.data.details.level.value, rank).modifier;
        }
      } catch (err) {
        console.log(`PF2E | Could not find martial skill for ${prof}`)
      }
    }
    data.proficiency = proficiency
    data.attackRoll = getAttackBonus(data) + (actorData.data.abilities?.[abl]?.mod ?? 0) + proficiency.value;

    const properties = [
      // (parseInt(data.range.value) > 0) ? `${data.range.value} feet` : null,
      // CONFIG.PF2E.weaponTypes[data.weaponType.value],
      // CONFIG.PF2E.weaponGroups[data.group.value]
    ];

    if (data.group.value) {
      data.critSpecialization = {
        label: PF2E.weaponGroups[data.group.value],
        description: PF2E.weaponDescriptions[data.group.value],
      };
    }

    data.isTwohanded = !!twohandedTrait;
    data.wieldedTwoHands = !!data.hands.value;
    data.isFinesse = isFinesse;
    data.properties = properties.filter((p) => !!p);
    data.traits = traits.filter((p) => !!p);

    const map = calculateMap(item);
    data.map2 = map.map2;
    data.map3 = map.map3;
    return data;
  },

  /* -------------------------------------------- */

  meleeChatData(item) {
    const data = JSON.parse(JSON.stringify(item.data));
    const traits = [];

    if ((data.traits.value || []).length !== 0) {
      for (let i = 0; i < data.traits.value.length; i++) {
        const traitsObject = {
          label: PF2E.weaponTraits[data.traits.value[i]] || (data.traits.value[i].charAt(0).toUpperCase() + data.traits.value[i].slice(1)),
          description: PF2E.traitsDescriptions[data.traits.value[i]] || '',
        };
        traits.push(traitsObject);
      }
    }

    const isAgile = (data.traits.value || []).includes('agile');
    data.map2 = isAgile ? '-4' : '-5';
    data.map3 = isAgile ? '-8' : '-10';
    data.traits = traits.filter((p) => !!p);
    return data;
  },

  /* -------------------------------------------- */

  consumableChatData(item) {
    const data = JSON.parse(JSON.stringify(item.data));
    data.consumableType.str = PF2E.consumableTypes[data.consumableType.value];
    data.properties = [data.consumableType.str, `${data.charges.value}/${data.charges.max} ${localize('PF2E.ConsumableChargesLabel')}`];
    data.hasCharges = data.charges.value >= 0;
    return data;
  },

  /* -------------------------------------------- */

  treasureChatData(item) {
    const data = JSON.parse(JSON.stringify(item.data));
    return data;
  },

  /* -------------------------------------------- */

  toolChatData(item, actorData) {
    const data = JSON.parse(JSON.stringify(item.data));
    const abl = actorData.data.abilities[data.ability.value].label;
    const prof = data.proficient.value || 0;
    const properties = [abl, PF2E.proficiencyLevels[prof]];
    data.properties = properties.filter((p) => p !== null);
    return data;
  },

  /* -------------------------------------------- */

  loreChatData(item, actorData) {
    const data = JSON.parse(JSON.stringify(item.data));
    if (actorData.type !== 'npc') {
      const abl = actorData.data.abilities[data.ability.value].label;
      const prof = data.proficient.value || 0;
      const properties = [abl, PF2E.proficiencyLevels[prof]];
      data.properties = properties.filter((p) => p !== null);
    }
    return data;
  },

  /* -------------------------------------------- */

  backpackChatData(item) {
    const data = JSON.parse(JSON.stringify(item.data));
    data.properties = [];
    return data;
  },

  /* -------------------------------------------- */

  spellChatData(item, actorData) {
    const data = JSON.parse(JSON.stringify(item.data));

    const spellcastingEntry = actorData.items.find(item => item._id === data.location.value);

    if (spellcastingEntry === null || spellcastingEntry.data.type !== 'spellcastingEntry') return {};

    const spellDC = spellcastingEntry.data.data.spelldc.dc;
    const spellAttack = spellcastingEntry.data.data.spelldc.value;

    // Spell saving throw text and DC
    data.isSave = data.spellType.value === 'save';

    if (data.isSave) {
      data.save.dc = spellDC;
    } else data.save.dc = spellAttack;
    data.save.str = data.save.value ? PF2E.saves[data.save.value.toLowerCase()] : '';

    // Spell attack labels
    data.damageLabel = data.spellType.value === 'heal' ? localize('PF2E.SpellTypeHeal') : localize('PF2E.DamageLabel');
    data.isAttack = data.spellType.value === 'attack';

    // Combine properties
    const props = [
      PF2E.spellLevels[data.level.value],
      `${localize('PF2E.SpellComponentsLabel')}: ${data.components.value}`,
      data.range.value ? `${localize('PF2E.SpellRangeLabel')}: ${data.range.value}` : null,
      data.target.value ? `${localize('PF2E.SpellTargetLabel')}: ${data.target.value}` : null,
      data.area.value ? `${localize('PF2E.SpellAreaLabel')}: ${PF2E.areaSizes[data.area.value]} ${PF2E.areaTypes[data.area.areaType]}` : null,
      data.areasize?.value ? `${localize('PF2E.SpellAreaLabel')}: ${data.areasize.value}` : null,
      data.time.value ? `${localize('PF2E.SpellTimeLabel')}: ${data.time.value}` : null,
      data.duration.value ? `${localize('PF2E.SpellDurationLabel')}: ${data.duration.value}` : null,
    ];
    data.spellLvl = {}.spellLvl;
    if (data.level.value < parseInt(data.spellLvl, 10)) {
      props.push(`Heightened: +${parseInt(data.spellLvl, 10) - data.level.value}`);
    }
    data.properties = props.filter((p) => p !== null);

    const traits = [];
    if ((data.traits.value || []).length !== 0) {
      for (let i = 0; i < data.traits.value.length; i++) {
        const traitsObject = {
          label: data.traits.value[i].charAt(0).toUpperCase() + data.traits.value[i].substr(1),
          description: PF2E.traitsDescriptions[data.traits.value[i]] || '',
        };
        traits.push(traitsObject);
      }
    }
    data.traits = traits.filter((p) => p);
    // Toggling this off for now
    /*     data.area = data.area.value ? {
      "label": `Area: ${CONFIG.PF2E.areaSizes[data.area.value]} ${CONFIG.PF2E.areaTypes[data.area.areaType]}`,
      "areaType": data.area.areaType,
      "size": data.area.value
    } : null; */

    return data;
  },

  /* -------------------------------------------- */

  featChatData(item) {
    const data = JSON.parse(JSON.stringify(item.data));

    /*     let traits = [];
    if ((data.traits.value || []).length != 0) {
      traits = duplicate(data.traits.value);
      for(var i = 0 ; i < traits.length ; i++){
        traits[i] = traits[i].charAt(0).toUpperCase() + traits[i].substr(1);
      }
    } */

    // Feat properties
    const props = [
      `Level ${data.level.value || 0}`,
      data.actionType.value ? PF2E.actionTypes[data.actionType.value] : null,
    ];
    // if (traits.length != 0) props = props.concat(traits);

    data.properties = props.filter((p) => p);

    const traits = [];
    if ((data.traits.value || []).length !== 0) {
      for (let i = 0; i < data.traits.value.length; i++) {
        const traitsObject = {
          label: PF2E.featTraits[data.traits.value[i]] || (data.traits.value[i].charAt(0).toUpperCase() + data.traits.value[i].slice(1)),
          description: PF2E.traitsDescriptions[data.traits.value[i]] || '',
        };
        traits.push(traitsObject);
      }
    }
    data.traits = traits.filter((p) => p);
    return data;
  },

  /* -------------------------------------------- */

  actionChatData(item, actorData) {
    const data = JSON.parse(JSON.stringify(item.data));

    /* let traits = [];
    if ((data.traits.value || []).length != 0) {
      traits = duplicate(data.traits.value);
      for(var i = 0 ; i < traits.length ; i++){
        traits[i] = traits[i].charAt(0).toUpperCase() + traits[i].substr(1);
      }
    } */

    let associatedWeapon = null;
    if (data.weapon.value) associatedWeapon = actorData.items.find(item => item._id === data.weapon.value);

    // Feat properties
    const props = [
      PF2E.actionTypes[data.actionType.value],
      associatedWeapon ? associatedWeapon.name : null,
    ];
    // if (traits.length != 0) props = props.concat(traits);

    data.properties = props.filter((p) => p);

    const traits = [];
    if ((data.traits.value || []).length !== 0) {
      for (let i = 0; i < data.traits.value.length; i++) {
        const traitsObject = {
          label: PF2E.featTraits[data.traits.value[i]] || (data.traits.value[i].charAt(0).toUpperCase() + data.traits.value[i].slice(1)),
          description: PF2E.traitsDescriptions[data.traits.value[i]] || '',
        };
        traits.push(traitsObject);
      }
    }
    data.traits = traits.filter((p) => p);

    return data;
  },

  /* -------------------------------------------- */

  conditionChatData(item) {
    const data = JSON.parse(JSON.stringify(item.data));
    data.properties = [];
    return data;
  },

  /* -------------------------------------------- */

  effectChatData(item) {
    const data = JSON.parse(JSON.stringify(item.data));
    data.properties = [];
    return data;
  }

}

/* -------------------------------------------- */

function getArmorBonus(itemData) {
  const potencyRune = toNumber(itemData?.potencyRune?.value) ?? 0;
  const baseArmor = toNumber(itemData.armor.value) ?? 0;
  return baseArmor + potencyRune;
}

/* -------------------------------------------- */

function getAttackBonus(itemData) {
  if (itemData.group?.value === 'bomb') {
      return toNumber(itemData?.bonus?.value) ?? 0;
  }
  return toNumber(itemData?.potencyRune?.value) ?? 0;
}

/* -------------------------------------------- */

function calculateMap(item) {
  if (item.type === 'weapon') {
    // calculate multiple attack penalty tiers
    const agile = (item.data.traits.value || []).includes('agile');
    const alternateMAP = (item.data.MAP || {}).value;
    switch (alternateMAP) {
      case '1': return { map2: -1, map3: -2 };
      case '2': return { map2: -2, map3: -4 };
      case '3': return { map2: -3, map3: -6 };
      case '4': return { map2: -4, map3: -8 };
      case '5': return { map2: -5, map3: -10 };
      default: {
        if (agile)
          return { map2: -4, map3: -8 };
        else
          return { map2: -5, map3: -10 };
      }
    }
  }
  return { map2: -5, map3: -10 };
}

/* -------------------------------------------- */

function addSign(number) {
  if (number < 0) {
      return `${number}`;
  }
  if (number > 0) {
      return `+${number}`;
  }
  return '0';
}

/* -------------------------------------------- */

function toNumber(value) {
  if (value === null || value === undefined || typeof value === 'number') {
      return value;
  }
  const result = parseInt(value, 10);
  if (Number.isNaN(result)) {
      return undefined;
  }
  return result;
}

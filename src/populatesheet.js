import Tabs from "./libs/tabs.js";
import localize from "./handlebars/helpers/stringify";
import { ProficiencyModifier } from "./libs/modifiers";

/**
 * might be different for different systems, but this initializes the sheet tabs
 */
const tabs = [
  {
    navSelector: ".sheet-navigation",
    contentSelector: ".sheet-content",
    initial: "character",
  },
];

const _tabs = createTabHandlers();

/* -------------------------------------------- */
/*   Sheet Populator                            */
/* -------------------------------------------- */

/**
 * @param  {HandlebarsTemplatable} sheetTemplate
 * @param  {Object} actorData
 * @param  {String} baseUrl
 */
function populateSheet(sheetTemplate, actorData, baseUrl) {
  /**
   * here you parse the json data into data you can send to the actor sheet
   */
  const data = getData(actorData, baseUrl);

  /**
   * here you send the data that the handlebars template reads from to the template
   */
  const templateObject = {
    actor: data.actorData,
    data: data.actorData.data,
    items: data.actorData.items,
    isCharacter: data.actorData.data.type === "character",
    isNPC: data.actorData.data.type === "npc",
    hasStamina: data.actorData.flags?.externalactor?.hasStamina || false,
    owner: true,
    baseUrl: baseUrl,
  };
  console.log(templateObject);
  $(".window-content")[0].innerHTML = sheetTemplate(templateObject, {
    allowedProtoProperties: {
      size: true,
    },
  });

  activateListeners();
}

/* -------------------------------------------- */

/**
 * @param  {Object} actorData
 * @param  {String} baseUrl
 */
function getData(actorData, baseUrl) {
  let items = actorData.items;

  items.sort((a, b) => (a.sort || 0) - (b.sort || 0));

  // alignment translate
  if (actorData.data.details?.alignment?.value) {
    actorData.data.details.alignment.value = PF2E.alignment[actorData.data.details.alignment.value];
  }

  // size translate
  if (actorData.data.traits?.size?.value) {
    actorData.data.traits.size.value = PF2E.actorSizes[actorData.data.traits.size.value];
  }

  // key ability translate
  if (actorData.data.details?.keyability?.value) {
    actorData.data.details.keyability.value = PF2E.abilities[actorData.data.details.keyability.value];
  }

  // ability labels
  Object.keys(actorData.data.abilities).forEach((key) => {
    actorData.data.abilities[key].label = PF2E.abilities[key];
  });

  // saves
  Object.keys(actorData.data.saves).forEach((key) => {
    actorData.data.saves[key].label = PF2E.saves[key];
    actorData.data.saves[key].rankName = PF2E.proficiencyLevels[actorData.data.saves[key].rank];
  });

  // heroPoints
  if (actorData.data.attributes.heroPoints) {
    actorData.data.attributes.heroPoints.icon = getHeroPointsIcon(actorData.data.attributes.heroPoints.rank);
    actorData.data.attributes.heroPoints.hover = PF2E.heroPointLevels[actorData.data.attributes.heroPoints.rank];
  }

  // dying
  if (actorData.data.attributes.dying) {
    actorData.data.attributes.dying.containerWidth = `width: ${actorData.data.attributes.dying.max * 13}px;`;
    actorData.data.attributes.dying.icon = getDyingIcon(actorData.data.attributes.dying.value, actorData);
  }

  // wounded
  if (actorData.data.attributes.wounded) {
    actorData.data.attributes.wounded.icon = getWoundedIcon(actorData.data.attributes.wounded.value, actorData);
    actorData.data.attributes.wounded.max = actorData.data.attributes.dying.max - 1;
  }

  // doomed
  if (actorData.data.attributes.doomed) {
    actorData.data.attributes.doomed.icon = getDoomedIcon(actorData.data.attributes.doomed.value, actorData);
    actorData.data.attributes.doomed.max = actorData.data.attributes.dying.max - 1;
  }

  // perception text
  if (actorData.data.attributes?.perception?.rank) {
    actorData.data.attributes.perception.rankName = PF2E.proficiencyLevels[actorData.data.attributes.perception.rank]
  }

  // class dc text
  if (actorData.data.attributes?.classDC?.rank) {
    actorData.data.attributes.classDC.rankName = PF2E.proficiencyLevels[actorData.data.attributes.classDC.rank]
  }

  prepareItems(actorData);

  // traits
  prepareTraits(actorData.data.traits);

  return {
    actorData,
    items,
  };
}

/* -------------------------------------------- */

function activateListeners() {
  // sheet object
  const html = $(".window-content").first();

  // bind tabs to pages
  _tabs.forEach((t) => t.bind(html[0]));

  {
    // ensure correct tab name is displayed after actor update
    const title = $(".sheet-navigation .active").data("tabTitle");
    if (title) {
      html.find(".navigation-title").text(title);
    }
  }

  html.find(".sheet-navigation").on("mouseover", ".item", (event) => {
    const title = event.currentTarget.dataset.tabTitle;
    if (title) {
      $(event.currentTarget).parents(".sheet-navigation").find(".navigation-title").text(title);
    }
  });

  html.find(".sheet-navigation").on("mouseout", ".item", (event) => {
    const parent = $(event.currentTarget).parents(".sheet-navigation");
    const title = parent.find(".item.active").data("tabTitle");
    if (title) {
      parent.find(".navigation-title").text(title);
    }
  });

  // handle sub-tab navigation on the actions tab
  html.find(".actions-nav").on("click", ".tab:not(.tab-active)", (event) => {
    const target = $(event.currentTarget);
    const nav = target.parents(".actions-nav");
    // deselect current tab and panel
    nav.children(".tab-active").removeClass("tab-active");
    nav.siblings(".actions-panels").children(".actions-panel.active").removeClass("active");
    // select new tab and panel
    target.addClass("tab-active");
    nav
      .siblings(".actions-panels")
      .children(`#${target.data("panel")}`)
      .addClass("active");
  });

  // Pad field width
  html.find("[data-wpad]").each((i, e) => {
    const text = e.tagName === "INPUT" ? e.value : e.innerText;
    const w = (text.length * parseInt(e.getAttribute("data-wpad"), 10)) / 2;
    e.setAttribute("style", `flex: 0 0 ${w}px`);
  });
}

/* -------------------------------------------- */
/*   Helper Functions                           */
/* -------------------------------------------- */

function createTabHandlers() {
  return tabs.map((t) => {
    return new Tabs(t);
  });
}

/* -------------------------------------------- */

function prepareTraits(traits) {
  if (traits === undefined) return;

  const map = {
    languages: PF2E.languages,
    dr: PF2E.resistanceTypes,
    di: PF2E.immunityTypes,
    dv: PF2E.weaknessTypes,
    ci: PF2E.immunityTypes,
    traits: PF2E.monsterTraits,
  };

  for (const [t, choices] of Object.entries(map)) {
    const trait = traits[t] || { value: [], selected: [] };

    if (Array.isArray(trait)) {
      trait.selected = {};
      for (const entry of trait) {
        if (typeof entry === "object") {
          if ("exceptions" in entry && entry.exceptions !== "") {
            trait.selected[entry.type] = `${choices[entry.type]} (${entry.value}) [${entry.exceptions}]`;
          } else {
            let text = `${choices[entry.type]}`;
            if (entry.value !== "") text = `${text} (${entry.value})`;
            trait.selected[entry.type] = text;
          }
        } else {
          trait.selected[entry] = choices[entry] || `${entry}`;
        }
      }
    } else if (trait.value) {
      trait.selected = Object.fromEntries(trait.value.map((name) => [name, name]));
    }

    // Add custom entry
    if (trait.custom) trait.selected.custom = trait.custom;
  }
}

/* -------------------------------------------- */

function prepareItems(actorData) {
  // Inventory
  const inventory = {
    weapon: { label: localize("PF2E.InventoryWeaponsHeader"), items: [] },
    armor: { label: localize("PF2E.InventoryArmorHeader"), items: [] },
    equipment: { label: localize("PF2E.InventoryEquipmentHeader"), items: [], investedItemCount: 0 },
    consumable: { label: localize("PF2E.InventoryConsumablesHeader"), items: [] },
    treasure: { label: localize("PF2E.InventoryTreasureHeader"), items: [] },
    backpack: { label: localize("PF2E.InventoryBackpackHeader"), items: [] },
  };

  // Spellbook
  // const spellbook = {};
  const tempSpellbook = [];
  const spellcastingEntriesList = [];
  const spellbooks = [];
  spellbooks.unassigned = {};

  // Spellcasting Entries
  const spellcastingEntries = [];

  // Feats
  const feats = {
    ancestry: { label: "PF2E.FeatAncestryHeader", feats: [] },
    ancestryfeature: { label: "PF2E.FeaturesAncestryHeader", feats: [] },
    archetype: { label: "PF2E.FeatArchetypeHeader", feats: [] },
    bonus: { label: "PF2E.FeatBonusHeader", feats: [] },
    class: { label: "PF2E.FeatClassHeader", feats: [] },
    classfeature: { label: "PF2E.FeaturesClassHeader", feats: [] },
    skill: { label: "PF2E.FeatSkillHeader", feats: [] },
    general: { label: "PF2E.FeatGeneralHeader", feats: [] },
    pfsboon: { label: "PF2E.FeatPFSBoonHeader", feats: [] },
    deityboon: { label: "PF2E.FeatDeityBoonHeader", feats: [] },
    curse: { label: "PF2E.FeatCurseHeader", feats: [] },
  };

  // Actions
  const actions = {
    action: { label: localize("PF2E.ActionsActionsHeader"), actions: [] },
    reaction: { label: localize("PF2E.ActionsReactionsHeader"), actions: [] },
    free: { label: localize("PF2E.ActionsFreeActionsHeader"), actions: [] },
  };

  // Read-Only Actions
  const readonlyActions = {
    interaction: { label: "Interaction Actions", actions: [] },
    defensive: { label: "Defensive Actions", actions: [] },
    offensive: { label: "Offensive Actions", actions: [] },
  };

  const readonlyEquipment = [];

  const attacks = {
    weapon: { label: "Compendium Weapon", items: [], type: "weapon" },
  };

  // Skills
  const lores = [];
  const martialSkills = [];

  // Iterate through items, allocating to containers
  // const bulkConfig = {
  //     ignoreCoinBulk: game.settings.get('pf2e', 'ignoreCoinBulk'),
  //     ignoreContainerOverflow: game.settings.get('pf2e', 'ignoreContainerOverflow'),
  // };

  // const bulkItems = itemsFromActorData(actorData);
  // const indexedBulkItems = indexBulkItemsById(bulkItems);
  // const containers = getContainerMap(actorData.items, indexedBulkItems, stacks, bulkConfig);

  let investedCount = 0; // Tracking invested items

  for (const i of actorData.items) {
    i.img = i.img || "icons/svg/mystery-man.svg";
    // i.containerData = containers.get(i._id);
    // i.isContainer = i.containerData.isContainer;
    // i.isNotInContainer = i.containerData.isNotInContainer;

    // Read-Only Equipment
    if (i.type === "armor" || i.type === "equipment" || i.type === "consumable" || i.type === "backpack") {
      readonlyEquipment.push(i);
      actorData.hasEquipment = true;
    }

    // i.canBeEquipped = i.isNotInContainer;
    i.isEquipped = i.data?.equipped?.value ?? false;
    i.isSellableTreasure = i.type === "treasure" && i.data?.stackGroup?.value !== "coins";
    i.hasInvestedTrait = i.data?.traits?.value?.includes("invested") ?? false;
    i.isInvested = i.data?.invested?.value ?? false;
    if (i.isInvested) {
      investedCount += 1;
    }

    // Inventory
    if (Object.keys(inventory).includes(i.type)) {
      i.data.quantity.value = i.data.quantity.value || 0;
      i.data.weight.value = i.data.weight.value || 0;
      // const [approximatedBulk] = calculateBulk([indexedBulkItems.get(i._id)], stacks, false, bulkConfig);
      // i.totalWeight = formatBulk(approximatedBulk);
      i.hasCharges = i.type === "consumable" && i.data.charges.max > 0;
      i.isTwoHanded = i.type === "weapon" && !!(i.data.traits.value || []).find((x) => x.startsWith("two-hand"));
      i.wieldedTwoHanded = i.type === "weapon" && (i.data.hands || {}).value;
      if (i.type === "weapon") {
        attacks.weapon.items.push(i);
      }
      inventory[i.type].items.push(i);
    }

    // !!Spells
    // else if (i.type === 'spell') {
    //   let item;
    //     try {
    //       item = this.actor.getOwnedItem(i._id);
    //       i.spellInfo = item.getSpellInfo();
    //     } catch (err) {
    //       console.log(`PF2e System | Character Sheet | Could not load item ${i.name}`)
    //     }
    //   tempSpellbook.push(i);
    // }

    //!! Spellcasting Entries
    // else if (i.type === 'spellcastingEntry') {
    //   // collect list of entries to use later to match spells against.
    //   spellcastingEntriesList.push(i._id);

    //   const spellRank = (i.data.proficiency?.value || 0);
    //   const spellProficiency = ProficiencyModifier.fromLevelAndRank(actorData.data.details.level.value, spellRank).modifier;
    //   const spellAbl = i.data.ability.value || 'int';
    //   const spellAttack = actorData.data.abilities[spellAbl].mod + spellProficiency + i.data.item.value;
    //   if (i.data.spelldc.value !== spellAttack) {
    //     const updatedItem = {
    //       _id: i._id,
    //       data: {
    //         spelldc: {
    //           value: spellAttack,
    //           dc: spellAttack + 10,
    //           mod: actorData.data.abilities[spellAbl].mod,
    //         },
    //       },
    //     };
    //     this.actor.updateEmbeddedEntity('OwnedItem', updatedItem);
    //   }
    //   i.data.spelldc.mod = actorData.data.abilities[spellAbl].mod;
    //   i.data.spelldc.breakdown = `10 + ${spellAbl} modifier(${actorData.data.abilities[spellAbl].mod}) + proficiency(${spellProficiency}) + item bonus(${i.data.item.value})`;

    //   i.data.spelldc.icon = this._getProficiencyIcon(i.data.proficiency.value);
    //   i.data.spelldc.hover = CONFIG.PF2E.proficiencyLevels[i.data.proficiency.value];
    //   i.data.tradition.title = CONFIG.PF2E.magicTraditions[i.data.tradition.value];
    //   i.data.prepared.title = CONFIG.PF2E.preparationType[i.data.prepared.value];
    //   // Check if prepared spellcasting type and set Boolean
    //   if ((i.data.prepared || {}).value === 'prepared') i.data.prepared.preparedSpells = true;
    //   else i.data.prepared.preparedSpells = false;
    //   // Check if Ritual spellcasting tradition and set Boolean
    //   if ((i.data.tradition || {}).value === 'ritual') i.data.tradition.ritual = true;
    //   else i.data.tradition.ritual = false;
    //   if ((i.data.tradition || {}).value === 'focus') {
    //     i.data.tradition.focus = true;
    //     if (i.data.focus === undefined) i.data.focus = { points: 1, pool: 1};
    //     i.data.focus.icon = this._getFocusIcon(i.data.focus);
    //   } else i.data.tradition.focus = false;

    //   spellcastingEntries.push(i);
    // }

    // Feats
    else if (i.type === "feat") {
      const featType = i.data.featType.value || "bonus";
      const actionType = i.data.actionType.value || "passive";

      feats[featType].feats.push(i);
      if (Object.keys(actions).includes(actionType)) {
        i.feat = true;
        let actionImg = 0;
        if (actionType === "action") actionImg = parseInt((i.data.actions || {}).value, 10) || 1;
        else if (actionType === "reaction") actionImg = "reaction";
        else if (actionType === "free") actionImg = "free";
        i.img = getActionImg(actionImg);
        actions[actionType].actions.push(i);

        // Read-Only Actions
        if (i.data.actionCategory && i.data.actionCategory.value) {
          switch (i.data.actionCategory.value) {
            case "interaction":
              readonlyActions.interaction.actions.push(i);
              actorData.hasInteractionActions = true;
              break;
            case "defensive":
              readonlyActions.defensive.actions.push(i);
              actorData.hasDefensiveActions = true;
              break;
            // Should be offensive but throw anything else in there too
            default:
              readonlyActions.offensive.actions.push(i);
              actorData.hasOffensiveActions = true;
          }
        } else {
          readonlyActions.offensive.actions.push(i);
          actorData.hasOffensiveActions = true;
        }
      }
    }

    // Lore Skills
    else if (i.type === "lore") {
      i.data.icon = getProficiencyIcon((i.data.proficient || {}).value);
      i.data.hover = PF2E.proficiencyLevels[(i.data.proficient || {}).value];

      const rank = i.data.proficient?.value || 0;
      const proficiency = ProficiencyModifier.fromLevelAndRank(actorData.data.details.level.value, rank).modifier;
      const modifier = actorData.data.abilities.int.mod;
      const itemBonus = Number((i.data.item || {}).value || 0);
      i.data.itemBonus = itemBonus;
      i.data.value = modifier + proficiency + itemBonus;
      i.data.breakdown = `int modifier(${modifier}) + proficiency(${proficiency}) + item bonus(${itemBonus})`;

      lores.push(i);
    }

    // Martial Skills
    else if (i.type === "martial") {
      i.data.icon = getProficiencyIcon((i.data.proficient || {}).value);
      i.data.hover = PF2E.proficiencyLevels[(i.data.proficient || {}).value];

      const rank = i.data.proficient?.value || 0;
      const proficiency = ProficiencyModifier.fromLevelAndRank(actorData.data.details.level.value, rank).modifier;
      /* const itemBonus = Number((i.data.item || {}).value || 0);
      i.data.itemBonus = itemBonus; */
      i.data.value = proficiency; // + itemBonus;
      i.data.breakdown = `proficiency(${proficiency})`;

      martialSkills.push(i);
    }

    // Actions
    if (i.type === "action") {
      const actionType = i.data.actionType.value || "action";
      let actionImg = 0;
      if (actionType === "action") actionImg = parseInt(i.data.actions.value, 10) || 1;
      else if (actionType === "reaction") actionImg = "reaction";
      else if (actionType === "free") actionImg = "free";
      else if (actionType === "passive") actionImg = "passive";
      i.img = getActionImg(actionImg);
      if (actionType === "passive") actions.free.actions.push(i);
      else actions[actionType].actions.push(i);

      // Read-Only Actions
      if (i.data.actionCategory && i.data.actionCategory.value) {
        switch (i.data.actionCategory.value) {
          case "interaction":
            readonlyActions.interaction.actions.push(i);
            actorData.hasInteractionActions = true;
            break;
          case "defensive":
            readonlyActions.defensive.actions.push(i);
            actorData.hasDefensiveActions = true;
            break;
          case "offensive":
            readonlyActions.offensive.actions.push(i);
            actorData.hasOffensiveActions = true;
            break;
          // Should be offensive but throw anything else in there too
          default:
            readonlyActions.offensive.actions.push(i);
            actorData.hasOffensiveActions = true;
        }
      } else {
        readonlyActions.offensive.actions.push(i);
        actorData.hasOffensiveActions = true;
      }
    }
  }

  inventory.equipment.investedItemCount = investedCount; // Tracking invested items

  const embeddedEntityUpdate = [];
  //! Iterate through all spells in the temp spellbook and check that they are assigned to a valid spellcasting entry. If not place in unassigned.
  // for (const i of tempSpellbook) {
  //   // check if the spell has a valid spellcasting entry assigned to the location value.
  //   if (spellcastingEntriesList.includes(i.data.location.value)) {
  //     const location = i.data.location.value;
  //     spellbooks[location] = spellbooks[location] || {};
  //     this._prepareSpell(actorData, spellbooks[location], i);
  //   } else if (spellcastingEntriesList.length === 1) { // if not BUT their is only one spellcasting entry then assign the spell to this entry.
  //     const location = spellcastingEntriesList[0];
  //     spellbooks[location] = spellbooks[location] || {};

  //     // Update spell to perminantly have the correct ID now
  //     // console.log(`PF2e System | Prepare Actor Data | Updating location for ${i.name}`);
  //     // this.actor.updateEmbeddedEntity("OwnedItem", { "_id": i._id, "data.location.value": spellcastingEntriesList[0]});
  //     embeddedEntityUpdate.push({ _id: i._id, 'data.location.value': spellcastingEntriesList[0] });

  //     this._prepareSpell(actorData, spellbooks[location], i);
  //   } else { // else throw it in the orphaned list.
  //     this._prepareSpell(actorData, spellbooks.unassigned, i);
  //   }
  // }

  // assign mode to actions
  Object.values(actions)
    .flatMap((section) => section.actions)
    .forEach((action) => {
      action.downtime = action.data.traits.value.includes("downtime");
      action.exploration = action.data.traits.value.includes("exploration");
      action.encounter = !(action.downtime || action.exploration);
    });

  // Assign and return
  actorData.inventory = inventory;
  // Any spells found that don't belong to a spellcasting entry are added to a "orphaned spells" spell book (allowing the player to fix where they should go)
  if (Object.keys(spellbooks.unassigned).length) {
    actorData.orphanedSpells = true;
    actorData.orphanedSpellbook = spellbooks.unassigned;
  }
  actorData.feats = feats;
  actorData.attacks = attacks;
  actorData.actions = actions;
  actorData.readonlyActions = readonlyActions;
  actorData.readonlyEquipment = readonlyEquipment;
  actorData.lores = lores;
  actorData.martialSkills = martialSkills;

  //!!
  // for (const entry of spellcastingEntries) {
  //   if (entry.data.prepared.preparedSpells && spellbooks[entry._id]) {
  //     this._preparedSpellSlots(entry, spellbooks[entry._id]);
  //   }
  //   entry.spellbook = spellbooks[entry._id];
  // }

  actorData.spellcastingEntries = spellcastingEntries;

  // shield
  const equippedShield = getEquippedShield(actorData.items);
  if (equippedShield === undefined) {
    actorData.data.attributes.shield = {
      hp: {
        value: 0,
      },
      maxHp: {
        value: 0,
      },
      armor: {
        value: 0,
      },
      hardness: {
        value: 0,
      },
      brokenThreshold: {
        value: 0,
      },
    };
    actorData.data.attributes.shieldBroken = false;
  } else {
    actorData.data.attributes.shield = JSON.parse(JSON.stringify(equippedShield.data));
    actorData.data.attributes.shieldBroken = equippedShield?.data?.hp?.value <= equippedShield?.data?.brokenThreshold?.value;
  }

  // Inventory encumbrance
  // FIXME: this is hard coded for now
  // const featNames = new Set(actorData.items
  //   .filter(item => item.type === 'feat')
  //   .map(item => item.name));

  // let bonusEncumbranceBulk = actorData.data.attributes.bonusEncumbranceBulk ?? 0;
  // let bonusLimitBulk = actorData.data.attributes.bonusLimitBulk ?? 0;
  // if (featNames.has('Hefty Hauler')) {
  //   bonusEncumbranceBulk += 2;
  //   bonusLimitBulk += 2;
  // }
  // const equippedLiftingBelt = actorData.items
  //   .find(item => item.name === 'Lifting Belt' && item.data.equipped.value) !== undefined;
  // if (equippedLiftingBelt) {
  //   bonusEncumbranceBulk += 1;
  //   bonusLimitBulk += 1;
  // }
  // const [bulk] = calculateBulk(bulkItems, stacks, false, bulkConfig);
  // actorData.data.attributes.encumbrance = calculateEncumbrance(
  //   actorData.data.abilities.str.mod,
  //   bonusEncumbranceBulk,
  //   bonusLimitBulk,
  //   bulk,
  //   actorData.data?.traits?.size?.value ?? 'med',
  // );
}

/* -------------------------------------------- */

function getActionImg(action) {
  const img = {
    0: "icons/svg/mystery-man.svg",
    1: "systems/pf2e/icons/actions/OneAction.png",
    2: "systems/pf2e/icons/actions/TwoActions.png",
    3: "systems/pf2e/icons/actions/ThreeActions.png",
    free: "systems/pf2e/icons/actions/FreeAction.png",
    reaction: "systems/pf2e/icons/actions/Reaction.png",
    passive: "systems/pf2e/icons/actions/Passive.png",
  };
  return img[action];
}

/* -------------------------------------------- */

function getProficiencyIcon(level) {
  const icons = {
    0: "",
    1: '<i class="fas fa-check-circle"></i>',
    2: '<i class="fas fa-check-circle"></i><i class="fas fa-check-circle"></i>',
    3: '<i class="fas fa-check-circle"></i><i class="fas fa-check-circle"></i><i class="fas fa-check-circle"></i>',
    4: '<i class="fas fa-check-circle"></i><i class="fas fa-check-circle"></i><i class="fas fa-check-circle"></i><i class="fas fa-check-circle"></i>',
  };
  return icons[level];
}

/* -------------------------------------------- */

function getEquippedShield(items) {
  return items.find((item) => item.type === "armor" && item.data.equipped.value && item.data.armorType.value === "shield");
}

/* -------------------------------------------- */

function getHeroPointsIcon(level) {
  const icons = {
    0: '<i class="far fa-circle"></i><i class="far fa-circle"></i><i class="far fa-circle"></i>',
    1: '<i class="fas fa-hospital-symbol"></i><i class="far fa-circle"></i><i class="far fa-circle"></i>',
    2: '<i class="fas fa-hospital-symbol"></i><i class="fas fa-hospital-symbol"></i><i class="far fa-circle"></i>',
    3: '<i class="fas fa-hospital-symbol"></i><i class="fas fa-hospital-symbol"></i><i class="fas fa-hospital-symbol"></i>',
  };
  return icons[level];
}

/* -------------------------------------------- */

function getDyingIcon(level, actorData) {
  const maxDying = actorData.data.attributes.dying.max || 4;
  const doomed = actorData.data.attributes.doomed.value || 0;
  const circle = '<i class="far fa-circle"></i>';
  const cross = '<i class="fas fa-times-circle"></i>';
  const skull = '<i class="fas fa-skull"></i>';
  const redOpen = "<span>";
  const redClose = "</span>";
  const icons = {};

  for (let dyingLevel = 0; dyingLevel <= maxDying; dyingLevel++) {
    icons[dyingLevel] = dyingLevel === maxDying ? redOpen : "";
    for (let column = 1; column <= maxDying; column++) {
      if (column >= maxDying - doomed || dyingLevel === maxDying) {
        icons[dyingLevel] += skull;
      } else if (dyingLevel < column) {
        icons[dyingLevel] += circle;
      } else {
        icons[dyingLevel] += cross;
      }
    }
    icons[dyingLevel] += dyingLevel === maxDying ? redClose : "";
  }

  return icons[level];
}

/* -------------------------------------------- */

function getWoundedIcon(level, actorData) {
  const maxDying = actorData.data.attributes.dying.max || 4;
  const icons = {};
  const usedPoint = '<i class="fas fa-dot-circle"></i>';
  const unUsedPoint = '<i class="far fa-circle"></i>';

  for (let i = 0; i < maxDying; i++) {
    let iconHtml = "";
    for (let iconColumn = 1; iconColumn < maxDying; iconColumn++) {
      iconHtml += iconColumn <= i ? usedPoint : unUsedPoint;
    }
    icons[i] = iconHtml;
  }

  return icons[level];
}

/* -------------------------------------------- */

function getDoomedIcon(level, actorData) {
  const maxDying = actorData.data.attributes.dying.max || 4;
  const icons = {};
  const usedPoint = '<i class="fas fa-skull"></i>';
  const unUsedPoint = '<i class="far fa-circle"></i>';

  for (let i = 0; i < maxDying; i++) {
    let iconHtml = "";
    for (let iconColumn = 1; iconColumn < maxDying; iconColumn++) {
      iconHtml += iconColumn <= i ? usedPoint : unUsedPoint;
    }
    icons[i] = iconHtml;
  }

  return icons[level];
}

/* -------------------------------------------- */

Array.fromRange = function (n) {
  return Array.from(new Array(parseInt(n)).keys());
};

/**
 * listens to the hook that tells it to start the population
 */

Hooks.on("showSheet", populateSheet);

# First7 Bible Dictionary Review

Senior Editor audit of `src/content/dictionary/` against `docs/dictionary.md`.

## Executive Summary

- Dictionary entries reviewed: 156.
- Overall structure is consistent: every entry uses `Meaning`, `Biblical Usage`, `Key References`, and `Related Terms`.
- No duplicate values were found in `scriptures`, `related`, `aliases`, `seeAlso`, or `tags`.
- No isolated entries were found in the related-term network.
- Main issues: missing `hebrew` or `greek` frontmatter fields in 58 entries, several `Biblical Usage` sections not beginning with `In Scripture...`, and many one-way related links that should probably be reciprocal.
- The current dictionary is strongest in abstract biblical concepts, worship terms, judgment/salvation terms, and prophetic vocabulary. It still needs broader coverage of people, places, feasts, offerings, priesthood, measurements, government, agriculture, animals, plants, and daily life.

## 1. Frontmatter

Required fields checked: `title`, `term`, `shortMeaning`, `biblicalUsage`, `reference`, `featuredVerse`, `scriptures`, `related`, `aliases`, `seeAlso`, `tags`, `hebrew`, `greek`.

### Missing Fields

These entries are missing one or more expected frontmatter fields:

- Missing `greek`: `altar`, `anakim`, `bashan`, `branch`, `burnt-offering`, `cedar`, `dagon`, `flood`, `giants`, `grove`, `nephilim`, `refuge`, `rephaim`, `sheol`, `watchman`.
- Missing `hebrew`: `apostasy`, `apostle`, `authority`, `body`, `book`, `bride`, `calling`, `carnal`, `comforter`, `conscience`, `conversion`, `deacon`, `devil`, `disciple`, `exhortation`, `faith`, `fellowship`, `forgiveness`, `fornication`, `gehenna`, `gospel`, `greed`, `hades`, `humility`, `idolatry`, `inner-man`, `intercession`, `mediator`, `mind`, `perdition`, `prayer`, `renewal`, `repentance`, `resurrection`, `sanctification`, `tartarus`, `tribulation`.
- Missing both `hebrew` and `greek`: `canaan`, `encounter`, `goliath`, `og`, `restoration`, `suddenly`.

Some of these may be intentionally omitted because the term is primarily associated with one testament or one language. Still, the style checklist names these as fields to check, so either the fields should be supplied or the content model should standardize empty objects/arrays for intentionally absent language data.

### Empty Arrays

The only repeated empty array pattern is `aliases: []`. This is acceptable for many entries, but should be intentional. Entries with empty aliases include:

`bashan`, `dagon`, `darkness`, `day`, `deacon`, `death`, `door`, `dove`, `dream`, `dust`, `dwelling`, `encounter`, `faith`, `fear`, `fellowship`, `flesh`, `flood`, `fornication`, `gehenna`, `glory`, `gold`, `goliath`, `gospel`, `grace`, `hades`, `heart`, `hell`, `holiness`, `hope`, `incense`, `inheritance`, `justice`, `light`, `love`, `mediator`, `mercy`, `mind`, `nephilim`, `obedience`, `og`, `oil`, `peace`, `perdition`, `redeemer`, `redemption`, `refuge`, `remnant`, `renewal`, `rephaim`, `sanctuary`, `sheol`, `strength`, `suddenly`, `tartarus`, `tribulation`, `truth`, `wisdom`, `worship`, `wrath`.

### Duplicate Values

No duplicate values were found in `scriptures`, `related`, `aliases`, `seeAlso`, or `tags`.

### Formatting Consistency

- The nested `reference`, `featuredVerse`, `hebrew`, and `greek` objects are consistently shaped where present.
- Frontmatter summaries often differ from the body sections. This is not necessarily wrong, but `biblicalUsage` in frontmatter and `## Biblical Usage` in the body sometimes use different openings or levels of detail.
- Several KJV quotations use ellipses inside the quotation text. This may be an intentional excerpt style, but the style guide says to preserve exact KJV wording and never paraphrase Scripture. Consider standardizing whether excerpted quotations with ellipses are permitted.

## 2. Meaning

Most Meaning sections follow the style guide: common English words begin with plain dictionary definitions, names identify the person/place/nation/event, and offices/beings/titles define the role.

Entries to review:

- `armageddon`: frontmatter `shortMeaning` says "A term used to describe a final great battle or conflict," while the body correctly identifies Armageddon as "the name of a place mentioned in the Book of Revelation." The body is closer to the style guide.
- `dragon`: the short meaning repeats itself: "A large serpent-like creature; a dragon."
- `gehenna`, `hades`, `sheol`, `tartarus`, `hell`, `grave`: these are appropriately concise, but the overlap between them needs careful cross-linking so readers do not confuse distinct terms.
- `burnt-offering`, `offering`, `sacrifice`: all are useful, but the borders between them should remain clear as more offering entries are added.

## 3. Biblical Usage

The style guide says Biblical Usage should begin with `In Scripture...`, remain descriptive, and avoid devotion, speculation, prophecy interpretation, or theological promotion.

### Body Sections Not Beginning With `In Scripture`

- `abomination`
- `altar`
- `anakim`
- `angel`
- `anointing`
- `apostasy`
- `apostle`
- `armageddon`
- `armor`

### Frontmatter `biblicalUsage` Not Beginning With `In Scripture`

- `altar`
- `angel`
- `anointing`
- `apostasy`
- `apostle`
- `armor`

### Possible Interpretive Wording

- `throne`: "a throne represents royal authority..." The entry is still neutral overall, but "represents" can read more interpretively than "is used for" or "is associated with."

No obvious devotional tone, denominational argument, or speculative prophecy interpretation was found in the reviewed entries.

## 4. Scripture

### Reference Formatting

Scripture references are generally formatted consistently as `Book Chapter:Verse` or `Book Chapter:Verse-Verse`.

### Duplicate References

No duplicate scripture references were found inside individual `scriptures` lists.

### Featured Verse Coverage

Featured verses are usually included within the broader `scriptures` list. Several are included only by range rather than exact verse. This is acceptable if intentional, but the pattern should be standardized:

`armageddon`, `army`, `branch`, `bread`, `burnt-offering`, `calling`, `candlestick`, `carnal`, `dagon`, `deacon`, `discipline`, `encounter`, `foundation`, `giants`, `goliath`, `grace`, `hell`, `hope`, `horn`, `incense`, `inheritance`, `lampstand`, `mercy`, `offering`, `olive-tree`, `prayer`, `resurrection`, `righteousness`.

### KJV Quotation Notes

- Several quotation fields contain ellipses. This should be reviewed against the KJV-only rule because an excerpt with ellipses is not the full verse wording.
- No quotation was rewritten during this audit.

## 5. Hebrew / Greek

### Missing Language Information

See the Missing Fields section above. The biggest frontmatter consistency issue is the absence of `hebrew` or `greek` fields in 58 entries.

### Transliteration Consistency

The transliteration field is consistently named `transliteration` where language objects exist.

### Encoding Display

The Hebrew and Greek original-word fields may display as mojibake in some terminal output. This may be a console encoding issue rather than a file issue, but it should be verified in the site UI and source editor.

## 6. Related Terms

### Duplicate Related Terms

No duplicate `related` values were found inside individual entries.

### Non-Entry Related Terms

Many `related` values point to terms that do not currently have dictionary pages. Some are legitimate future entries; others may belong better in `seeAlso`.

High-value missing related entries include:

- People/groups/offices: `abraham`, `joshua`, `levite`, `messenger`, `missionary`, `bishop`, `elder`, `false prophet`, `teacher`, `servant`, `soldier`, `ruler`, `judge`.
- Places/nations: `israel`, `promised land`, `philistines`, `lebanon`, `gath`.
- Concepts: `wickedness`, `uncleanness`, `falling away`, `unbelief`, `rebellion`, `prophecy`, `war`, `host`, `atonement`, `passover`, `slavery`, `liberty`, `scripture`, `law`, `church`, `marriage`, `holy spirit`, `evil`, `temptation`, `revelation`, `presence`, `communion`, `unity`, `reconciliation`, `covetousness`, `purity`, `knowledge`, `understanding`, `supplication`.
- Objects/symbols: `shield`, `helmet`, `sword`, `manna`, `unleavened bread`, `ephod`, `tabernacle`, `ark`, `idol`, `lamp`, `gate`, `vine`, `tree`, `root`, `holy place`.

### Missing Reciprocal Links

The related-term network is connected, but many existing entry-to-entry relationships are one-way. These should be reviewed for reciprocal links.

Important reciprocal candidates:

- `abomination` -> `idolatry`, `holiness`
- `altar` -> `covenant`, `worship`
- `anakim` -> `canaan`
- `angel` -> `heaven`
- `anointing` -> `priest`, `king`
- `apostasy` -> `idolatry`
- `apostle` -> `gospel`
- `armageddon` -> `battle`, `judgment`
- `armor` -> `breastplate`
- `blameless` -> `righteousness`, `holiness`, `obedience`
- `blood` -> `sacrifice`, `covenant`
- `burnt-offering` -> `sacrifice`, `altar`, `offering`, `priest`
- `captivity` -> `deliverance`
- `censer` -> `incense`, `altar`, `priest`
- `conversion` -> `faith`, `obedience`, `salvation`
- `creation` -> `heaven`
- `death` -> `judgment`
- `deliverance` -> `salvation`, `redemption`
- `desolation` -> `destruction`, `judgment`, `abomination`
- `destruction` -> `judgment`, `death`, `wrath`
- `fast` -> `prayer`, `repentance`, `worship`
- `flesh` -> `spirit`
- `forgiveness` -> `grace`
- `gehenna` -> `hell`, `judgment`, `hades`
- `gospel` -> `salvation`, `kingdom`, `faith`, `grace`
- `hades` -> `hell`, `death`, `grave`, `sheol`
- `hell` -> `grave`, `death`, `judgment`
- `horn` -> `altar`, `trumpet`, `king`, `kingdom`
- `incense` -> `altar`, `prayer`, `temple`
- `mediator` -> `covenant`, `priest`
- `nephilim` -> `giants`, `anakim`, `rephaim`
- `offering` -> `priest`, `incense`
- `peace` -> `love`, `grace`, `mercy`, `hope`
- `repentance` -> `faith`, `obedience`
- `sheol` -> `hell`, `grave`, `death`
- `tartarus` -> `hell`, `judgment`, `darkness`
- `temple` -> `priest`, `altar`
- `truth` -> `faith`, `righteousness`
- `worship` -> `temple`, `sacrifice`
- `wrath` -> `judgment`, `justice`

## 7. See Also

Many `seeAlso` terms are strong candidates for future dictionary entries.

High-value missing `seeAlso` entries:

- `angel of the lord`
- `gabriel`
- `michael`
- `day of the lord`
- `tabernacle`
- `ark`
- `ark of the covenant`
- `passover`
- `sin offering`
- `peace offering`
- `trespass offering`
- `meat offering`
- `high priest`
- `leviathan`
- `book of life`
- `body of christ`
- `holy place`
- `most holy place`
- `lake of fire`
- `second death`
- `great white throne`
- `judgment seat`
- `mark of the beast`
- `seal of god`
- `city of refuge`
- `shewbread`
- `urim`
- `thummim`
- `kinsman redeemer`
- `scribe`
- `signet`
- `shepherd`
- `shofar`
- `last trump`

Some `seeAlso` values duplicate concepts already present under slightly different names or spellings:

- `lamp` vs `lampstand` / `candlestick`
- `armour` vs `armor`
- `holy ghost` vs `holy spirit`
- `unleavened bread` vs `bread`
- `word` vs `scripture`
- `revelation` vs `vision` / `prophecy`

## 8. Missing Dictionary Entries

### High Priority

- God
- LORD
- Jesus Christ
- Christ
- Son of God
- Son of man
- Holy Ghost / Holy Spirit
- Father
- Word
- Scripture
- Law
- Commandment
- Sin
- Wickedness
- Evil
- Unbelief
- Righteous
- Justification
- Atonement
- Reconciliation
- Passover
- Tabernacle
- Ark of the Covenant
- High Priest
- Levite
- Scribe
- Pharisee
- Sadducee
- Israel
- Jerusalem
- Egypt
- Babylon
- Zion
- David
- Moses
- Abraham
- Isaac
- Jacob
- Joshua
- Noah
- Adam
- Eve
- Satan
- Serpent
- Lake of Fire
- Day of the Lord
- Great Tribulation
- Mark of the Beast
- Book of Life

### Medium Priority

- Burnt Offering already exists, but related offerings are missing: `Sin Offering`, `Trespass Offering`, `Peace Offering`, `Meat Offering`, `Drink Offering`, `Wave Offering`, `Heave Offering`, `Firstfruits`.
- Priesthood terms: `Ephod`, `Urim`, `Thummim`, `Holy Place`, `Most Holy Place`, `Mercy Seat`, `Veil`.
- People/groups: `Cherubim`, `Seraphim`, `Gabriel`, `Michael`, `Philistines`, `Amalekites`, `Canaanites`, `Moabites`, `Ammonites`, `Edomites`, `Assyrians`, `Chaldeans`.
- Worship/law: `Sabbath`, `Feast`, `Feast of Unleavened Bread`, `Feast of Tabernacles`, `Day of Atonement`, `Tithe`, `Vow`, `Oath`.
- Prophecy: `False Prophet`, `Antichrist`, `Mystery Babylon`, `Trumpet Judgments`, `First Resurrection`, `Second Death`, `New Heaven`, `New Earth`.
- Daily life: `Shepherd`, `Vineyard`, `Harvest`, `Seed`, `Manna`, `Shewbread`, `Sling`, `Sackcloth`, `Ashes`.

### Low Priority

- Objects/materials: `Silver`, `Brass`, `Iron`, `Precious Stones`, `Frankincense`, `Myrrh`.
- Plants/animals: `Fig Tree`, `Vine`, `Lily`, `Hyssop`, `Lion`, `Lamb`, `Goat`, `Raven`, `Ox`, `Serpent`.
- Measurements/time: `Cubit`, `Talent`, `Shekel`, `Ephah`, `Homer`, `Watch`, `Season`, `Year`, `Month`.
- Geography: `Jordan`, `Hebron`, `Gilead`, `Megiddo`, `Gath`, `Lebanon`, `Wilderness`, `Sea`.

## 9. Cross-Link Network

The dictionary has no isolated entries. Every entry has related terms, and every entry is connected to the larger network.

Network improvements:

- Add reciprocal links for the strongest one-way relationships listed above.
- Decide whether non-entry `related` values should remain in `related` as planned future entries or move to `seeAlso`.
- Strengthen clusters around: offerings, priesthood, temple/tabernacle, death/hell terms, prophecy terms, salvation terms, and nations/places.
- Add dictionary pages for repeated non-entry hubs such as `law`, `scripture`, `prophecy`, `tabernacle`, `passover`, `holy spirit`, `church`, `israel`, `promised land`, `atonement`, `satan`, `serpent`, and `false prophet`.

## 10. Consistency

- Headings are consistent across all entries.
- Bullet style is consistent.
- YAML array formatting is consistent.
- `aliases: []` is common and acceptable if intentional.
- `Biblical Usage` body sections are generally concise and neutral, but nine entries do not begin with the required phrase.
- Some entries use British/KJV-style spellings in related terms or seeAlso, such as `armour`, while filenames and terms use modern American spellings such as `armor`. This should be standardized or intentionally preserved.
- Several terms have both frontmatter usage summaries and body usage sections that do not match exactly. This can be acceptable, but the project should define whether frontmatter is a teaser or a canonical copy.

## 11. Duplicate Topics / Overlap

Potential overlap to monitor:

- `redemption` / `redeemer`
- `hades` / `hell` / `sheol` / `gehenna` / `tartarus` / `grave`
- `offering` / `sacrifice` / `burnt-offering`
- `candlestick` / `lampstand`
- `body` / `flesh` / `inner-man`
- `spirit` / `soul` / `breath`
- `justice` / `judgment` / `righteousness`
- `mercy` / `grace` / `forgiveness`
- `truth` / `wisdom` / `discernment`
- `battle` / `army` / `armor`
- `beast` / `dragon` / `mark`

No merge recommendation is made. These are simply areas where entry boundaries should stay clear.

## 12. Editorial Ratings

Ratings reflect current editorial readiness, not theological value.

### Needs Review

- `abomination`: Biblical Usage body does not begin with `In Scripture`.
- `altar`: Missing `greek`; Biblical Usage frontmatter and body do not begin with `In Scripture`.
- `anakim`: Missing `greek`; Biblical Usage body does not begin with `In Scripture`.
- `angel`: Biblical Usage frontmatter and body do not begin with `In Scripture`.
- `anointing`: Biblical Usage frontmatter and body do not begin with `In Scripture`.
- `apostasy`: Missing `hebrew`; Biblical Usage frontmatter and body do not begin with `In Scripture`.
- `apostle`: Missing `hebrew`; Biblical Usage frontmatter and body do not begin with `In Scripture`.
- `armageddon`: Biblical Usage body does not begin with `In Scripture`; Meaning/frontmatter wording should be aligned.
- `armor`: Biblical Usage frontmatter and body do not begin with `In Scripture`.
- `authority`: Missing `hebrew`.
- `bashan`: Missing `greek`.
- `body`: Missing `hebrew`.
- `book`: Missing `hebrew`.
- `branch`: Missing `greek`.
- `bride`: Missing `hebrew`.
- `burnt-offering`: Missing `greek`.
- `calling`: Missing `hebrew`.
- `canaan`: Missing `hebrew` and `greek`.
- `carnal`: Missing `hebrew`.
- `cedar`: Missing `greek`.
- `comforter`: Missing `hebrew`.
- `conscience`: Missing `hebrew`.
- `conversion`: Missing `hebrew`.
- `dagon`: Missing `greek`.
- `deacon`: Missing `hebrew`.
- `devil`: Missing `hebrew`.
- `disciple`: Missing `hebrew`.
- `encounter`: Missing `hebrew` and `greek`.
- `exhortation`: Missing `hebrew`.
- `faith`: Missing `hebrew`.
- `fellowship`: Missing `hebrew`.
- `flood`: Missing `greek`.
- `forgiveness`: Missing `hebrew`.
- `fornication`: Missing `hebrew`.
- `gehenna`: Missing `hebrew`.
- `giants`: Missing `greek`.
- `goliath`: Missing `hebrew` and `greek`.
- `gospel`: Missing `hebrew`.
- `greed`: Missing `hebrew`.
- `grove`: Missing `greek`.
- `hades`: Missing `hebrew`.
- `humility`: Missing `hebrew`.
- `idolatry`: Missing `hebrew`.
- `inner-man`: Missing `hebrew`.
- `intercession`: Missing `hebrew`.
- `mediator`: Missing `hebrew`.
- `mind`: Missing `hebrew`.
- `nephilim`: Missing `greek`.
- `og`: Missing `hebrew` and `greek`.
- `perdition`: Missing `hebrew`.
- `prayer`: Missing `hebrew`.
- `refuge`: Missing `greek`.
- `renewal`: Missing `hebrew`.
- `repentance`: Missing `hebrew`.
- `rephaim`: Missing `greek`.
- `restoration`: Missing `hebrew` and `greek`.
- `resurrection`: Missing `hebrew`.
- `sanctification`: Missing `hebrew`.
- `sheol`: Missing `greek`.
- `suddenly`: Missing `hebrew` and `greek`.
- `tartarus`: Missing `hebrew`.
- `throne`: Possible interpretive wording in Biblical Usage.
- `tribulation`: Missing `hebrew`.
- `watchman`: Missing `greek`.

### Good

These entries are structurally sound and editorially usable, with only normal network/coverage improvements suggested:

`army`, `battle`, `beast`, `blameless`, `blessing`, `blood`, `bondage`, `bread`, `breastplate`, `breath`, `brother`, `burden`, `candlestick`, `captivity`, `censer`, `covenant`, `creation`, `crown`, `darkness`, `day`, `death`, `deception`, `deliverance`, `desolation`, `destruction`, `discernment`, `discipline`, `door`, `dove`, `dragon`, `dream`, `dust`, `dwelling`, `eagle`, `enemy`, `fast`, `fear`, `flesh`, `foundation`, `fruit`, `glory`, `gold`, `governor`, `grace`, `grave`, `heart`, `heaven`, `hell`, `holiness`, `hope`, `horn`, `image`, `incense`, `inheritance`, `judgment`, `justice`, `king`, `kingdom`, `lampstand`, `leaven`, `light`, `love`, `mark`, `mercy`, `obedience`, `offering`, `oil`, `olive-tree`, `peace`, `priest`, `promise`, `prophet`, `redeemer`, `redemption`, `remnant`, `righteousness`, `sacrifice`, `salvation`, `sanctuary`, `scroll`, `seal`, `soul`, `spirit`, `strength`, `temple`, `trumpet`, `truth`, `vision`, `wisdom`, `witness`, `worship`, `wrath`.

### Excellent

No entry is rated Excellent in this pass because the review standard includes cross-link reciprocity, language-field consistency, and coverage maturity. Many Good entries are close.

### Critical

No entry is rated Critical.

## 13. Statistics

- Dictionary entries reviewed: 156
- Excellent: 0
- Good: 93
- Needs Review: 63
- Critical: 0
- Average scriptures per entry: 7.66
- Average related terms: 3.99
- Average see also terms: 3.03
- Entries with Hebrew: 113
- Entries with Greek: 135
- Entries without Hebrew: 43
- Entries without Greek: 21

## 14. Coverage Report

### God

High priority: `God`, `LORD`, `Father`, `Most High`, `Almighty`, `Name of the LORD`.

Medium priority: `Creator`, `Lord`, `Lord God`, `I AM`, `Jealous`, `Holy One`.

### Jesus Christ

High priority: `Jesus Christ`, `Christ`, `Son of God`, `Son of man`, `Lord Jesus`, `Lamb`, `Saviour`.

Medium priority: `Word`, `Messiah`, `Branch` already exists, `Root`, `Cornerstone`, `Bridegroom`, `Advocate`.

### Holy Spirit

High priority: `Holy Ghost`, `Holy Spirit`, `Spirit of God`, `Spirit of Truth`.

Medium priority: `Comforter` already exists, `Gift`, `Anointing` already exists.

### People

High priority: `Adam`, `Eve`, `Noah`, `Abraham`, `Isaac`, `Jacob`, `Moses`, `Joshua`, `David`, `Solomon`, `Joseph`, `Daniel`, `Paul`, `Peter`, `John`.

Medium priority: `Saul`, `Samuel`, `Elijah`, `Elisha`, `Isaiah`, `Jeremiah`, `Ezekiel`, `Mary`, `Martha`, `Lazarus`.

### Places

High priority: `Jerusalem`, `Egypt`, `Babylon`, `Zion`, `Jordan`, `Wilderness`, `Promised Land`.

Medium priority: `Hebron`, `Gilead`, `Megiddo`, `Gath`, `Lebanon`, `Sinai`, `Bethlehem`, `Nazareth`, `Galilee`.

### Nations

High priority: `Israel`, `Judah`, `Philistines`, `Canaanites`, `Egyptians`, `Babylon`.

Medium priority: `Amalekites`, `Moabites`, `Ammonites`, `Edomites`, `Assyrians`, `Chaldeans`, `Greeks`, `Romans`.

### Objects

High priority: `Ark`, `Ark of the Covenant`, `Tabernacle`, `Veil`, `Mercy Seat`, `Ephod`, `Scribe`, `Signet`.

Medium priority: `Shield`, `Helmet`, `Sword`, `Sling`, `Scroll` already exists, `Book` already exists, `Trumpet` already exists.

### Animals

High priority: `Lamb`, `Lion`, `Serpent`, `Goat`, `Ox`.

Medium priority: `Dove` already exists, `Eagle` already exists, `Raven`, `Leviathan`, `Behemoth`.

### Plants

High priority: `Vine`, `Fig Tree`, `Olive`, `Hyssop`.

Medium priority: `Cedar` already exists, `Olive Tree` already exists, `Lily`, `Thorn`, `Tares`, `Wheat`.

### Measurements

High priority: `Cubit`, `Talent`, `Shekel`.

Medium priority: `Ephah`, `Homer`, `Bath`, `Omer`, `Mite`, `Penny`.

### Time

High priority: `Sabbath`, `Day of the Lord`, `Watch`, `Season`.

Medium priority: `Hour`, `Month`, `Year`, `New Moon`, `Evening`, `Morning`.

### Feasts

High priority: `Passover`, `Feast of Unleavened Bread`, `Day of Atonement`, `Feast of Tabernacles`, `Firstfruits`.

Medium priority: `Pentecost`, `Feast of Trumpets`, `New Moon`.

### Offerings

High priority: `Sin Offering`, `Trespass Offering`, `Peace Offering`, `Meat Offering`, `Drink Offering`.

Medium priority: `Wave Offering`, `Heave Offering`, `Firstfruits`, `Tithe`, `Vow`.

### Priesthood

High priority: `High Priest`, `Levite`, `Ephod`, `Urim`, `Thummim`, `Holy Place`, `Most Holy Place`.

Medium priority: `Aaron`, `Sons of Aaron`, `Consecration`, `Holy Oil`.

### Kings

High priority: `David`, `Solomon`, `Saul`, `Kingdom of God`, `Kingdom of Heaven`.

Medium priority: `Reign`, `Dominion`, `Prince`, `Governor` already exists.

### Prophets

High priority: `False Prophet`, `Seer`, `Prophecy`, `Revelation`.

Medium priority: `Isaiah`, `Jeremiah`, `Ezekiel`, `Daniel`, `Elijah`, `Elisha`.

### Worship

High priority: `Praise`, `Thanksgiving`, `Singing`, `Prayer` already exists, `Fast` already exists.

Medium priority: `Psalm`, `Hymn`, `Incense` already exists, `Altar` already exists.

### Law

High priority: `Law`, `Commandment`, `Testament`, `Ordinance`, `Statute`.

Medium priority: `Judgment` already exists, `Justice` already exists, `Oath`, `Vow`.

### Covenants

High priority: `Noahic Covenant`, `Abrahamic Covenant`, `New Covenant`, `Ark of the Covenant`.

Medium priority: `Promise` already exists, `Oath`, `Testament`.

### Salvation

High priority: `Justification`, `Atonement`, `Reconciliation`, `Regeneration`, `New Birth`.

Medium priority: `Forgiveness` already exists, `Redemption` already exists, `Redeemer` already exists, `Sanctification` already exists.

### Prophecy

High priority: `Day of the Lord`, `Great Tribulation`, `Antichrist`, `False Prophet`, `Mark of the Beast`, `Lake of Fire`, `Second Death`.

Medium priority: `Mystery Babylon`, `Trumpet Judgments`, `First Resurrection`, `New Heaven`, `New Earth`.

### Geography

High priority: `Jordan`, `Jerusalem`, `Zion`, `Egypt`, `Babylon`, `Wilderness`.

Medium priority: `Hebron`, `Gilead`, `Megiddo`, `Gath`, `Lebanon`, `Sea`, `River`.

### Daily Life

High priority: `Shepherd`, `House`, `Gate`, `Servant`, `Bridegroom`, `Marriage`, `Bread` already exists.

Medium priority: `Vineyard`, `Harvest`, `Seed`, `Sower`, `Fisher`, `Net`, `Wine`, `Garment`.

### Government

High priority: `Ruler`, `Judge`, `Prince`, `Governor` already exists, `King` already exists.

Medium priority: `Captain`, `Magistrate`, `Elder`, `Council`, `Throne` already exists.

### Warfare

High priority: `War`, `Sword`, `Shield`, `Helmet`, `Soldier`, `Captain`.

Medium priority: `Bow`, `Spear`, `Sling`, `Host`, `Victory`, `Armour`.

### Agriculture

High priority: `Seed`, `Harvest`, `Vineyard`, `Wheat`, `Tares`, `Firstfruits`.

Medium priority: `Threshingfloor`, `Winepress`, `Fig Tree`, `Olive`, `Rain`, `Dew`.


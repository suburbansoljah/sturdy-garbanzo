// Master NRS, Local Codes & Nevada DMV License Plate Database
const statutes = [
    // CRIMES AGAINST EXECUTIVE POWER & PUBLIC JUSTICE
    { code: "NRS 197.010/020", title: "Bribery of Official", level: "CAT C FEL", category: "person", badge: "badge-cat-c", noc: "N/A", booking: "N/A", summary: "Offering, giving, asking, or receiving a bribe to influence official action.", elements: ["Executive officer involved", "Intent to influence or agreement to be influenced", "Overt gift, offer, or solicitation"] },
    { code: "NRS 197.090", title: "Resisting Executive Officer", level: "GROSS MISD", category: "person", badge: "badge-misd", noc: "N/A", booking: "N/A", summary: "Deterring executive officer from legal duty using force or threats.", elements: ["Executive officer performing legal duty", "Physical force, violence, or direct threat used"] },
    { code: "NRS 197.120", title: "Impersonating Officer", level: "GROSS MISD", category: "person", badge: "badge-misd", noc: "N/A", booking: "N/A", summary: "Falsely pretending to be public/peace officer and performing official act.", elements: ["False pretense of being peace officer", "Overt exercise of police authority"] },
    { code: "NRS 197.190", title: "False Information / Obstructing Officer", level: "MISDEMEANOR", category: "person", badge: "badge-misd", noc: "52312", booking: "4810", summary: "Knowingly making false statement or obstructing officer discharging duties.", elements: ["Officer executing lawful duty", "Knowingly providing false/misleading info or obstruction"] },
    { code: "NRS 199.120", title: "Perjury", level: "CAT D FEL", category: "person", badge: "badge-cat-d", noc: "N/A", booking: "N/A", summary: "Making material false statement under oath knowing it to be false.", elements: ["Statement under oath/penalty of perjury", "Materiality to proceeding", "Knowledge of falsity"] },
    { code: "NRS 199.280", title: "Resisting a Public Officer", level: "MISD / CAT C FEL", category: "person", badge: "badge-cat-c", noc: "52990", booking: "4804", summary: "Willfully resisting, delaying, or opposing public officer executing legal duty.", elements: ["Officer executing legal duty/arrest", "Willful resistance or obstruction", "Upgraded to Cat C Felony if armed with dangerous weapon (NOC 55104/55106)"] },
    { code: "NRS 199.300", title: "Intimidating Public Officer", level: "CAT C FEL", category: "person", badge: "badge-cat-c", noc: "52995", booking: "4805", summary: "Threats, force, or violence to influence or retaliate against public officer/employee.", elements: ["Target is public officer, juror, or employee", "Threats or force used to influence official acts"] },

    // CRIMES AGAINST PERSONS & DOMESTIC VIOLENCE
    { code: "NRS 33.018", title: "Domestic Violence Acts", level: "STATUTORY DEF", category: "person", badge: "badge-civil", noc: "N/A", booking: "N/A", summary: "Battery, assault, coercion, stalking, or harassment between domestic relations.", elements: ["Relationship: spouse, cohabitant, relative, dating partner, child", "Commission of qualifying criminal act"] },
    { code: "NRS 33.100", title: "DV Protective Order Violation", level: "MISD / CAT D FEL", category: "person", badge: "badge-cat-d", noc: "52916", booking: "N/A", summary: "Intentionally violating valid TPO/EPO after lawful service.", elements: ["Valid protective order issued", "Lawful service/notice to subject", "Willful breach of order terms"] },
    { code: "NRS 200.010/030", title: "Murder (1st / 2nd Degree)", level: "CAT A FEL", category: "person", badge: "badge-cat-a", noc: "N/A", booking: "N/A", summary: "Unlawful killing with malice aforethought, premeditation, or felony murder.", elements: ["1st Degree: Premeditated design or felony murder rule", "2nd Degree: Implied malice / depraved heart"] },
    { code: "NRS 200.290", title: "Aiming Firearm at Person", level: "GROSS MISD", category: "person", badge: "badge-misd", noc: "51447", booking: "N/A", summary: "Aiming a firearm at a person without malice or self-defense.", elements: ["Aiming firearm at human being", "Without intent to injure or kill, and not in self-defense"] },
    { code: "NRS 200.366", title: "Sexual Assault", level: "CAT A FEL", category: "person", badge: "badge-cat-a", noc: "N/A", booking: "N/A", summary: "Sexual penetration against victim's will or without legal capacity to consent.", elements: ["Non-consensual sexual penetration", "Against victim will or victim incapable of consent"] },
    { code: "NRS 200.380", title: "Robbery", level: "CAT B FEL", category: "person", badge: "badge-cat-b", noc: "N/A", booking: "N/A", summary: "Taking personal property from person/presence by force, violence, or threat.", elements: ["Unlawful taking from person/presence", "Accomplished by force, violence, or immediate threat"] },
    { code: "NRS 200.471", title: "Assault / ADW", level: "MISD / CAT B FEL", category: "person", badge: "badge-cat-b", noc: "50200 / 50201", booking: "5024", summary: "Unlawful attempt or placing another in apprehension of immediate bodily harm.", elements: ["Intentional creation of reasonable apprehension or attempt", "Present physical ability", "Cat B Felony if committed with deadly weapon"] },
    { code: "NRS 200.481/485", title: "Battery / Domestic Battery", level: "MISD / GROSS / FEL", category: "person", badge: "badge-cat-c", noc: "50212 / 50235", booking: "8017", summary: "Willful and unlawful use of force or violence upon another person.", elements: ["Unlawful physical force applied intentionally", "Enhancements: DV relationship (NOC 50235), strangulation (Cat C - NOC 50214), deadly weapon/substantial harm (Cat B)"] },
    { code: "NRS 200.508", title: "Child Abuse / Neglect", level: "MISD / CAT B FEL", category: "person", badge: "badge-cat-b", noc: "55222 / 55226", booking: "CC", summary: "Permitting child under 18 to suffer unjustifiable pain, mental harm, or hazard.", elements: ["Responsibility over child < 18", "Intentional or negligent act creating hazard or mental/physical harm"] },
    { code: "NRS 200.571", title: "Harassment", level: "MISD / CAT C FEL", category: "person", badge: "badge-cat-c", noc: "50328", booking: "9992", summary: "Threatening harm, property damage, or confinement causing reasonable fear.", elements: ["Knowing threat of bodily injury/property damage", "Causes reasonable fear in victim"] },
    { code: "NRS 200.575", title: "Stalking / Aggravated Stalking", level: "MISD / CAT B/C FEL", category: "person", badge: "badge-cat-b", noc: "N/A", booking: "N/A", summary: "Repeated course of conduct causing fear, intimidation, or terror.", elements: ["Willful, repeated course of conduct", "Causes fear/intimidation", "Aggravated Stalking (Cat B) if fear of death or substantial harm"] },

    // PROPERTY CRIMES, LARCENY & BURGLARY
    { code: "NRS 205.060", title: "Burglary (Res / Comm / Auto)", level: "MISD / CAT B/C/D", category: "property", badge: "badge-cat-b", noc: "50424", booking: "9991", summary: "Entering structure, vehicle, or dwelling with intent to commit felony/larceny.", elements: ["Residential (Cat B), Commercial (Cat C), Auto (1st Misd, 2nd Cat E, 3rd Cat D)", "Intent to commit felony or larceny upon entry"] },
    { code: "NRS 205.222", title: "Grand Larceny", level: "CAT B/C/D FEL", category: "property", badge: "badge-cat-c", noc: "56001 / 56008", booking: "CC", summary: "Stealing property valued at $1,200 or more without consent.", elements: ["Value $1.2k-$5k (Cat D)", "Value $5k-$25k (Cat C)", "Value $25k+ (Cat B)"] },
    { code: "NRS 205.226", title: "Larceny of Firearm", level: "CAT B FEL", category: "property", badge: "badge-cat-b", noc: "N/A", booking: "N/A", summary: "Intentionally stealing any firearm regardless of value.", elements: ["Stealing firearm of another", "Regardless of monetary value"] },
    { code: "NRS 205.228", title: "Larceny of Auto", level: "CAT B/C FEL", category: "property", badge: "badge-cat-b", noc: "56011 / 56014", booking: "CC", summary: "Intentionally stealing or driving away another's motor vehicle.", elements: ["Taking/driving motor vehicle without consent", "Intent to permanently deprive"] },
    { code: "NRS 205.240", title: "Petit Larceny", level: "MISDEMEANOR", category: "property", badge: "badge-misd", noc: "50535", booking: "5513", summary: "Stealing personal property valued under $1,200.", elements: ["Taking property under $1,200 value", "Intent to permanently deprive owner"] },
    { code: "NRS 205.275", title: "Possession of Stolen Property", level: "MISD / CAT B/C/D", category: "property", badge: "badge-misd", noc: "56054", booking: "5518", summary: "Buying, receiving, or possessing property knowing or believing it to be stolen.", elements: ["Possessing stolen property or license plates", "Knowledge or reasonable belief that property was stolen"] },
    { code: "NRS 205.465", title: "Possession / Use of False ID", level: "MISD / CAT C FEL", category: "property", badge: "badge-misd", noc: "50698", booking: "5561", summary: "Possessing, manufacturing, or using false ID to commit fraud or establish age.", elements: ["Knowing possession or presentation of false ID", "Intent to commit fraud, evade law enforcement, or purchase restricted items"] },
    { code: "NRS 206.310", title: "Vandalism / Property Injury", level: "MISD / GROSS / CAT C", category: "property", badge: "badge-misd", noc: "50904 / 52597", booking: "9532", summary: "Maliciously destroying or defacing real/personal property.", elements: ["Under $250 (Misd - NOC 50904)", "$250-$5,000 (Gross Misd - NOC 52597)", "$5,000+ (Cat C Felony - NOC 52598)"] },
    { code: "NRS 207.200", title: "Trespassing", level: "MISDEMEANOR", category: "property", badge: "badge-misd", noc: "53166", booking: "5711", summary: "Entering or remaining on property after warning or posted No Trespass signs.", elements: ["Entry/remaining without authority", "Sufficient notice posted or explicit owner warning"] },

    // WEAPONS & PUBLIC SAFETY
    { code: "NRS 202.350", title: "Carrying Concealed Weapon (CCW)", level: "GROSS / CAT C FEL", category: "person", badge: "badge-cat-c", noc: "51457 / 58664", booking: "1113", summary: "Carrying handgun or dangerous weapon concealed without valid permit.", elements: ["Weapon hidden from ordinary observation", "Lacking valid CCW permit"] },
    { code: "NRS 202.360", title: "Prohibited Person in Possession of Firearm", level: "CAT B FEL", category: "person", badge: "badge-cat-b", noc: "51460", booking: "9992", summary: "Convicted felon, DV offender, or drug addict possessing any firearm.", elements: ["Custody/control of firearm", "Prohibited legal status (felon, DV conviction, fugitive)"] },

    // CONTROLLED SUBSTANCES
    { code: "NRS 453.336", title: "Possession of Controlled Substance (PCS)", level: "MISD / CAT E FEL", category: "drugs", badge: "badge-cat-e", noc: "51127 / 51137", booking: "9769", summary: "Unlawful actual or constructive possession of Schedule I-V substance.", elements: ["Knowing physical control/dominion", "Schedule I-V drug without valid prescription", "Marijuana <1oz 3rd GM (NOC 51137)"] },
    { code: "NRS 453.337/338", title: "PCS for Sale", level: "CAT B/C/D FEL", category: "drugs", badge: "badge-cat-b", noc: "51150", booking: "CC", summary: "Unlawful possession with specific intent to sell/distribute.", elements: ["Possession of controlled drug", "Specific intent to sell (proven by packaging, scales, ledgers)"] },
    { code: "NRS 453.3385", title: "Drug Trafficking", level: "CAT A/B FEL", category: "drugs", badge: "badge-cat-a", noc: "51156 / 51168", booking: "CC", summary: "Knowingly possessing/selling Schedule I/II drugs over weight thresholds.", elements: ["Low Tier (Cat B): 100g to 399g", "High Tier (Cat A): 400g or more"] },
    { code: "NRS 453.566", title: "Drug Paraphernalia", level: "MISDEMEANOR", category: "drugs", badge: "badge-misd", noc: "51339", booking: "1107", summary: "Possessing items intended to ingest, package, or produce drugs.", elements: ["Possession of equipment/items", "Intent to use for drug consumption/production"] },

    // TRAFFIC & VEHICLE STATUTES
    { code: "NRS 482.385", title: "Non-Resident Registration", level: "CIVIL INFRACTION", category: "traffic", badge: "badge-civil", noc: "53637", booking: "0114", summary: "Operating vehicle past 30 days of establishing NV residency.", elements: ["Established NV residency >30 days", "Operating vehicle with out-of-state tags"] },
    { code: "NRS 482.545", title: "Unregistered / Fictitious Plates", level: "MISDEMEANOR", category: "traffic", badge: "badge-misd", noc: "53656 / 53657", booking: "0105/0106", summary: "Displaying altered, canceled, suspended, or fictitious registration plates.", elements: ["Operating vehicle without current registration", "Displaying fictitious or altered license plate"] },
    { code: "NRS 483.280", title: "Instruction Permit Violation", level: "MISDEMEANOR / CIVIL", category: "traffic", badge: "badge-civil", noc: "53705", booking: "0202", summary: "Driving on instruction permit without licensed driver 21+ present.", elements: ["Operating on instruction permit", "No licensed driver 21+ occupying passenger seat"] },
    { code: "NRS 483.360", title: "Restricted License Violation", level: "MISDEMEANOR", category: "traffic", badge: "badge-misd", noc: "53707", booking: "0205", summary: "Operating vehicle outside specific medical, work, or time restrictions.", elements: ["Valid restricted driver license", "Operating outside specific statutory/court limits"] },
    { code: "NRS 483.550", title: "No Valid Driver License", level: "MISDEMEANOR", category: "traffic", badge: "badge-misd", noc: "53720", booking: "0200", summary: "Operating motor vehicle on highway without ever obtaining license.", elements: ["Driving motor vehicle on public highway", "Never obtained valid driver license"] },
    { code: "NRS 483.560", title: "Driving Suspended / Revoked", level: "MISDEMEANOR", category: "traffic", badge: "badge-misd", noc: "53722 / 53723", booking: "0209/0217", summary: "Driving while license privilege is suspended, revoked, or canceled.", elements: ["Driving motor vehicle on public highway", "Knowledge/notice of suspension or revocation status"] },
    { code: "NRS 484B.127", title: "Following Too Closely", level: "CIVIL INFRACTION", category: "traffic", badge: "badge-civil", noc: "53794", booking: "0608", summary: "Following another vehicle more closely than reasonable and prudent.", elements: ["Following behind vehicle without safe stopping buffer", "Unsafe speed/distance for road conditions"] },
    { code: "NRS 484B.165", title: "Handheld Cell Phone / Distracted", level: "CIVIL INFRACTION", category: "traffic", badge: "badge-civil", noc: "55927", booking: "2001", summary: "Manually operating wireless device while driving (1st Civil, 2nd+ Misd).", elements: ["Manually holding/operating wireless phone/device while driving", "Exemptions: Law enforcement on official duty, reporting emergency"] },
    { code: "NRS 484B.223", title: "Unsafe Lane Change / Fail Maintain Lane", level: "CIVIL INFRACTION", category: "traffic", badge: "badge-civil", noc: "53788", booking: "1523", summary: "Failing to maintain single lane or changing lanes unsafely.", elements: ["Deviating from marked lane without safety check", "Changing lanes without signal"] },
    { code: "NRS 484B.257/307", title: "Disregard Traffic Light / Stop Sign", level: "CIVIL INFRACTION", category: "traffic", badge: "badge-civil", noc: "58013 / 53760", booking: "0499", summary: "Disregarding steady red signal light, red arrow, or posted stop sign.", elements: ["Entering intersection past limit line against steady red light or stop sign"] },
    { code: "NRS 484B.443", title: "Refusal to Move Obstructing Vehicle", level: "MISDEMEANOR", category: "traffic", badge: "badge-misd", noc: "53756", booking: "0400", summary: "Refusing officer order to move traffic-obstructing vehicle.", elements: ["Vehicle parked/stopped obstructing traffic", "Driver refuses direct lawful order by peace officer to move"] },
    { code: "NRS 484B.463(4)", title: "Disability Placard Fraud", level: "MISDEMEANOR", category: "traffic", badge: "badge-misd", noc: "53926", booking: "1716", summary: "Fraudulent use, lending, or altering handicap parking placard.", elements: ["Displaying handicap placard not issued to driver/passenger", "Fraudulent intent to gain parking privilege"] },
    { code: "NRS 484B.483", title: "Commercial / Storage Parking Prohibited", level: "CIVIL INFRACTION", category: "traffic", badge: "badge-civil", noc: "53932", booking: "1703", summary: "Parking commercial vehicle or storing vehicle on public street over limits.", elements: ["Parking commercial vehicle in residential area", "Leaving vehicle stored on public street >72 hours"] },
    { code: "NRS 484B.510", title: "Restricted Zone Parking", level: "CIVIL INFRACTION", category: "traffic", badge: "badge-civil", noc: "53942", booking: "1703", summary: "Parking in posted restricted, loading, or official government zones.", elements: ["Parking in clearly posted restricted zone", "No official permit or authorization displayed"] },
    { code: "NRS 484B.600", title: "Basic Speed Rule / Due Care", level: "CIVIL INFRACTION", category: "traffic", badge: "badge-civil", noc: "53845 / 53849", booking: "1010", summary: "Driving faster than reasonable or failing due care in weather.", elements: ["Exceeding maximum posted limit or driving unsafe for conditions"] },
    { code: "NRS 484B.650", title: "Aggressive Driving", level: "MISDEMEANOR", category: "traffic", badge: "badge-misd", noc: "53888", booking: "1109", summary: "Creating hazard by combining speeding with 2+ moving violations.", elements: ["Speeding combined with tailgating, unsafe lane changes, or failing to yield"] },
    { code: "NRS 484B.653", title: "Reckless Driving / Trick Driving", level: "MISD / CAT B FEL", category: "traffic", badge: "badge-cat-b", noc: "55040 / 61769", booking: "1100", summary: "Driving in willful or wanton disregard for safety of persons or property.", elements: ["Willful/wanton disregard for safety", "Trick/stunt driving display (NOC 61769)", "Upgraded to Cat B Felony if causing substantial bodily harm or death"] },
    { code: "NRS 484C.110", title: "DUI (Alcohol or Drugs)", level: "MISD / CAT B FEL", category: "traffic", badge: "badge-cat-b", noc: "53900 / 53914", booking: "1104", summary: "Driving or actual physical control while impaired or BAC >= 0.08%.", elements: ["Driving or actual physical control on public highway/premises", "Impaired performance or BAC >= 0.08%", "3rd Offense or Injury/Death (NOC 53914 / 53906) = Cat B Felony"] },
    { code: "NRS 484D.230", title: "Unsafe Vehicle Operation", level: "MISDEMEANOR", category: "traffic", badge: "badge-misd", noc: "54000", booking: "1800", summary: "Driving vehicle in unsafe condition creating immediate hazard.", elements: ["Operating vehicle with defective brakes, steering, or tires", "Unsafe condition creating hazard on public highway"] },
    { code: "NRS 484D.495", title: "Seat Belt Required", level: "CIVIL INFRACTION", category: "traffic", badge: "badge-civil", noc: "54057", booking: "1836", summary: "Operating vehicle without wearing safety belt.", elements: ["Driver or passenger unbelted while vehicle in motion", "Secondary enforcement rule applies"] },
    { code: "NRS 484E.010", title: "Hit & Run (Injury / Death)", level: "CAT B FEL", category: "traffic", badge: "badge-cat-b", noc: "53743", booking: "CC", summary: "Failing to stop, render aid, or give info after crash causing injury/death.", elements: ["Involved in crash resulting in bodily injury or death", "Willfully failing to immediately stop at scene"] },
    { code: "NRS 484E.020", title: "Hit & Run (Property Damage)", level: "MISDEMEANOR", category: "traffic", badge: "badge-misd", noc: "53744", booking: "0301", summary: "Failing to stop and exchange info after accident with property damage only.", elements: ["Crash resulting in property damage", "Driver failed to stop and provide driver info/registration"] },
    { code: "NRS 485.187", title: "No Insurance Required", level: "CIVIL / MISD", category: "traffic", badge: "badge-civil", noc: "54095", booking: "0111", summary: "Operating vehicle without active Nevada liability insurance policy.", elements: ["Operating vehicle registered in NV without mandatory active coverage"] },

    ,
    // PARKING, TOWING & STATE PROPERTY ENFORCEMENT
    { code: "NRS 331.200 / SAM 0300", title: "State Property Parking Violation / Towing", level: "CIVIL / MISD", category: "local", badge: "badge-civil", noc: "53942", booking: "1703", summary: "Unauthorized parking on state-owned, state-leased, or Nevada Capitol complex property.", elements: ['Vehicle parked on state-administered property without valid permit/authorization', 'Violation of clearly posted state administrative sign rules (SAM 0300)', 'Subject to immediate citation, impoundment, or relocation tow'] },
    { code: "NRS 484B.450", title: "Stopping, Standing, or Parking Prohibited Places", level: "CIVIL INFRACTION", category: "traffic", badge: "badge-civil", noc: "53930", booking: "1700", summary: "Parking/stopping on sidewalk, double parking, in front of driveway, or inside intersection.", elements: ['Stopping or parking on sidewalk or crosswalk', 'Double parking alongside vehicle stopped at curb', 'Blocking public or private driveway or roadway intersection'] },
    { code: "NRS 484B.457", title: "Parking Near Fire Hydrant / Fire Station", level: "CIVIL INFRACTION", category: "traffic", badge: "badge-civil", noc: "53936", booking: "1701", summary: "Parking within 15 feet of fire hydrant or 20 feet of fire station driveway entrance.", elements: ['Parked within 15 feet of fire hydrant', 'Parked within 20 feet of fire station entrance driveway'] },
    { code: "NRS 484B.467", title: "Handicapped Parking Space Violation", level: "CIVIL / MISD", category: "traffic", badge: "badge-civil", noc: "53940", booking: "1715", summary: "Parking in designated accessible/handicap space or blue access aisle without valid placard/plate.", elements: ['Parked in space marked for persons with disabilities or striped hatch aisle', 'No valid disability placard, decal, or PH license plate displayed', 'Individual transporting disability permit holder not present'] },
    { code: "NRS 484B.470", title: "Unattended Motor Vehicle (Keys in Ignition / Brake)", level: "CIVIL INFRACTION", category: "traffic", badge: "badge-civil", noc: "53928", booking: "1704", summary: "Leaving motor vehicle unattended without stopping engine, locking ignition, and setting brake.", elements: ['Vehicle engine left running while unattended', 'Ignition key left in ignition switch', 'Parking brake not effectively set or front wheels turned on grade'] },
    { code: "NRS 484B.500", title: "Angle Parking / Parallel Parking Compliance", level: "CIVIL INFRACTION", category: "traffic", badge: "badge-civil", noc: "53938", booking: "1702", summary: "Failing to park parallel within 18 inches of right-hand curb or against traffic direction.", elements: ['Parked more than 18 inches from right curb', 'Parked facing opposite direction of lawful traffic flow (left wheels to curb)'] },
    { code: "NRS 487.230 / 484B.483", title: "Abandoned Vehicle on Public Right-of-Way", level: "CIVIL / TOW", category: "traffic", badge: "badge-civil", noc: "53934", booking: "1705", summary: "Leaving vehicle unattended on public roadway or right-of-way over 72 hours.", elements: ['Vehicle left unattended on public highway or street > 72 consecutive hours', 'Vehicle inoperable, dismantled, or lacking current registration plates', 'Subject to 48-hour tow notice tag and impoundment'] },
    { code: "LVCC 11.52.020", title: "Metered Parking Violation (City of Las Vegas)", level: "CIVIL INFRACTION", category: "local", badge: "badge-civil", noc: "53944", booking: "1720", summary: "Parking in metered space without paying required fee or after meter expiration.", elements: ['Parked in municipal metered space during active hours', 'Failed to deposit required payment or time expired on meter/app'] },
    { code: "LVCC 11.52.130", title: "Red Curb / Fire Lane Parking (City)", level: "CIVIL INFRACTION", category: "local", badge: "badge-civil", noc: "53936", booking: "1701", summary: "Stopping, standing, or parking alongside red curb or designated fire emergency lane.", elements: ['Parked alongside curb painted red or clearly posted Fire Lane', 'Impeding emergency service vehicle access'] },
    { code: "CCC 14.60.190", title: "Commercial Vehicle Parking in Residential Area (County)", level: "CIVIL INFRACTION", category: "local", badge: "badge-civil", noc: "53932", booking: "1703", summary: "Parking commercial vehicle > 10,000 lbs GVWR on residential street in Clark County.", elements: ['Commercial motor vehicle, tow truck, or semi-trailer', 'Parked on public street in residential zoning district', 'Exceeds weight/size thresholds outside active loading/unloading'] },

    // LOCAL MUNICIPAL CODES (CITY OF LAS VEGAS & CLARK COUNTY)
    { code: "LVCC 6.02.060", title: "Business License Required (City)", level: "MISDEMEANOR", category: "local", badge: "badge-misd", noc: "56730", booking: "0813", summary: "Conducting business within Las Vegas city limits without active license.", elements: ["Engaging in commercial activity inside City of Las Vegas without license"] },
    { code: "LVCC 10.47.020", title: "Obstruct Pedestrian / Vehicle Traffic", level: "MISDEMEANOR", category: "local", badge: "badge-misd", noc: "57084", booking: "0718", summary: "Blocking or impeding public sidewalk or roadway traffic.", elements: ["Impeding free passage of pedestrians or vehicles in public right of way"] },
    { code: "LVCC 10.76.010", title: "Open Container of Alcohol (City)", level: "MISDEMEANOR", category: "local", badge: "badge-misd", noc: "56979", booking: "0705", summary: "Possessing open alcohol container in public outside designated zones.", elements: ["Open alcohol container on public sidewalk, park, or street"] },
    { code: "LVCC 10.40.040", title: "Public Urination / Defecation", level: "MISDEMEANOR", category: "local", badge: "badge-misd", noc: "57043", booking: "5135", summary: "Urinating or defecating in public place or unapproved facility.", elements: ["Urinating/defecating in public view or public property"] },
    { code: "CCC 6.04.010", title: "Business License Required (County)", level: "MISDEMEANOR", category: "local", badge: "badge-misd", noc: "56730", booking: "N/A", summary: "Operating business in unincorporated Clark County without license.", elements: ["Unlicensed commercial operation in Clark County jurisdiction"] },
    { code: "CCC 12.33.010", title: "Disorderly Conduct (County)", level: "MISDEMEANOR", category: "local", badge: "badge-misd", noc: "56761", booking: "5133", summary: "Engaging in violent, noisy, or offensive conduct in public.", elements: ["Breach of peace or disorderly behavior in public county area"] },
    { code: "CCC 12.35.010", title: "Open Container (County)", level: "MISDEMEANOR", category: "local", badge: "badge-misd", noc: "56712", booking: "N/A", summary: "Open alcohol container in public area within 1,000 ft of liquor store.", elements: ["Carrying open container on public property within prohibited county zone"] },
    { code: "CCC 12.40.020", title: "Public Audio Disturbance (75ft)", level: "MISDEMEANOR", category: "local", badge: "badge-misd", noc: "57931", booking: "N/A", summary: "Operating vehicle stereo audible from 75+ feet away on public street.", elements: ["Sound amplification system clearly audible at distance of 75 feet or more"] }
];

// Master Nevada DMV License Plate Prefixes Database (87 Types)
const plateDatabase = [
    { type: "Agriculture", prefix: "AG", full: "4", small: "AG", status: "Active" },
    { type: "Air Force Thunderbirds", prefix: "SD", full: "4", small: "N/A", status: "Active" },
    { type: "Animal Appreciation", prefix: "SN", full: "4", small: "SN", status: "Active" },
    { type: "Antique Vehicle Truck/Tractor", prefix: "AVT", full: "3", small: "N/A", status: "Active" },
    { type: "Autism", prefix: "GH", full: "4", small: "GH", status: "Active" },
    { type: "Aviation", prefix: "AV", full: "4", small: "N/A", status: "Discontinued*" },
    { type: "Bronze Star", prefix: "BZ", full: "4", small: "BZ", status: "Active" },
    { type: "Carpenters", prefix: "UB", full: "4", small: "N/A", status: "Discontinued*" },
    { type: "Childhood Cancer", prefix: "AC", full: "4", small: "AC", status: "Active" },
    { type: "Children in the Arts", prefix: "AR", full: "4", small: "AR", status: "Active" },
    { type: "Citizenship Project", prefix: "CP", full: "4", small: "CP", status: "Active" },
    { type: "Civil Air Patrol", prefix: "CVAP", full: "4", small: "N/A", status: "Active" },
    { type: "Classic Rod", prefix: "CROD", full: "4", small: "N/A", status: "Active" },
    { type: "Classic Vehicle", prefix: "CVEH", full: "4", small: "N/A", status: "Active" },
    { type: "Collegiate - UNLV", prefix: "ULV", full: "5", small: "UV", status: "Active" },
    { type: "Collegiate - UNR", prefix: "UNR", full: "5", small: "UR", status: "Active" },
    { type: "Congressional Medal of Honor", prefix: "CONMH", full: "2", small: "N/A", status: "Active" },
    { type: "Conserve Wildlife", prefix: "CW", full: "4", small: "CW", status: "Active" },
    { type: "Desert Conservation", prefix: "DT", full: "4", small: "DT", status: "Active" },
    { type: "Disabled", prefix: "PH", full: "5", small: "N/A", status: "Active" },
    { type: "Disabled Veteran", prefix: "DV", full: "4", small: "N/A", status: "Active" },
    { type: "Ducks Unlimited", prefix: "DU", full: "4", small: "N/A", status: "Discontinued*" },
    { type: "Eagle Scout", prefix: "EG", full: "4", small: "EG", status: "Active" },
    { type: "Electric Vehicle", prefix: "EC", full: "4", small: "EC", status: "Active" },
    { type: "Ex-Prisoner of War", prefix: "POW", full: "3", small: "N/A", status: "Active" },
    { type: "Fallen Military", prefix: "FM", full: "4", small: "FM", status: "Active" },
    { type: "Fire Truck", prefix: "FT", full: "4", small: "N/A", status: "Active" },
    { type: "Forever Strong", prefix: "FS", full: "4", small: "FS", status: "Active" },
    { type: "Friends of LVMPD Police", prefix: "PD", full: "4", small: "PD", status: "Active" },
    { type: "Girl Scout Gold", prefix: "GG", full: "4", small: "GG", status: "Active" },
    { type: "Gold Star", prefix: "FV", full: "4", small: "FV", status: "Active" },
    { type: "Golden Rule", prefix: "LG", full: "4", small: "LG", status: "Active" },
    { type: "Great Reno Balloon Race", prefix: "GR", full: "4", small: "GR", status: "Active" },
    { type: "Hall of Fame", prefix: "HF", full: "5", small: "N/A", status: "Active" },
    { type: "Henderson Commemorative", prefix: "HN", full: "4", small: "HN", status: "Active" },
    { type: "Heritage of Sparks", prefix: "HS", full: "4", small: "HS", status: "Discontinued*" },
    { type: "Hoover Dam", prefix: "BC", full: "4", small: "BC", status: "Active" },
    { type: "Horse Power", prefix: "HP", full: "4", small: "HP", status: "Discontinued*" },
    { type: "Hot August Nights", prefix: "RS", full: "4", small: "RS", status: "Active" },
    { type: "Lake Tahoe", prefix: "LT", full: "5", small: "LT (4)", status: "Active" },
    { type: "Las Vegas Commemorative", prefix: "LV", full: "4", small: "LV", status: "Active" },
    { type: "Las Vegas Springs Preserve", prefix: "VS", full: "5", small: "VS", status: "Active" },
    { type: "March of Dimes", prefix: "SC", full: "4", small: "SC", status: "Discontinued*" },
    { type: "Masons", prefix: "MS", full: "4", small: "MS", status: "Active" },
    { type: "Missing and Exploited Children", prefix: "MX", full: "4", small: "MX", status: "Active" },
    { type: "Mt. Charleston", prefix: "MT", full: "4", small: "MT", status: "Active" },
    { type: "Nevada 150th Anniversary", prefix: "NV", full: "4", small: "NV", status: "Discontinued*" },
    { type: "Nevada Airport Managers", prefix: "AP", full: "4", small: "AP", status: "Discontinued*" },
    { type: "Nevada Bighorns Unlimited", prefix: "EW", full: "4", small: "EW", status: "Active" },
    { type: "Nevada Health Centers", prefix: "PK", full: "4", small: "PK", status: "Active" },
    { type: "Nevada Libraries", prefix: "NL", full: "4", small: "N/A", status: "Discontinued*" },
    { type: "Nevada National Guard", prefix: "NG", full: "4", small: "N/A", status: "Active" },
    { type: "Nevada Test Site", prefix: "AT", full: "4", small: "AT", status: "Active" },
    { type: "Nevada Tourism", prefix: "NV", full: "4", small: "N/A", status: "Discontinued*" },
    { type: "Old Timer", prefix: "OT", full: "4", small: "OTM (2)", status: "Active" },
    { type: "Opportunity Village", prefix: "XX", full: "4", small: "XX", status: "Active" },
    { type: "Organ Donor", prefix: "DL", full: "4", small: "DL", status: "Active" },
    { type: "Outside Las Vegas", prefix: "FL", full: "4", small: "FL", status: "Discontinued*" },
    { type: "Peace Officer", prefix: "ND", full: "3", small: "N/A", status: "Active" },
    { type: "Pearl Harbor Survivor", prefix: "PHS", full: "3", small: "N/A", status: "Active" },
    { type: "Pearl Harbor Veteran", prefix: "PHV", full: "3", small: "N/A", status: "Active" },
    { type: "Press", prefix: "PRS", full: "3", small: "N/A", status: "Active" },
    { type: "Professional Firefighter", prefix: "PF", full: "4", small: "PF", status: "Active" },
    { type: "Public Education", prefix: "DE", full: "4", small: "DE", status: "Active" },
    { type: "Purple Heart", prefix: "HRT", full: "5", small: "HT", status: "Active" },
    { type: "Pyramid Lake", prefix: "PL", full: "4", small: "PLMC", status: "Active" },
    { type: "Raiders", prefix: "AL", full: "4", small: "AL", status: "Active" },
    { type: "Red Rock Canyon", prefix: "RC", full: "4", small: "RC", status: "Active" },
    { type: "Reno Commemorative", prefix: "RN", full: "4", small: "RN", status: "Discontinued*" },
    { type: "Reno Air Races", prefix: "RR", full: "4", small: "RR", status: "Active" },
    { type: "Rodeo", prefix: "NR", full: "4", small: "NR", status: "Active" },
    { type: "Search and Rescue", prefix: "SR", full: "4", small: "N/A", status: "Discontinued*" },
    { type: "Silver Star", prefix: "SL", full: "4", small: "SL", status: "Active" },
    { type: "STEM Education", prefix: "PI", full: "4", small: "PI", status: "Active" },
    { type: "Street Rod", prefix: "SROD", full: "4", small: "N/A", status: "Active" },
    { type: "Share the Road", prefix: "PB", full: "4", small: "PB", status: "Discontinued*" },
    { type: "Support Wildlife", prefix: "SW", full: "4", small: "SW", status: "Active" },
    { type: "Supporting Healthcare", prefix: "SH", "full": "4", small: "SH", status: "Discontinued*" },
    { type: "Teamsters", prefix: "TM", full: "4", small: "TM", status: "Discontinued*" },
    { type: "UFC (Ultimate Fighting)", prefix: "HW", full: "4", small: "HW", status: "Active" },
    { type: "United We Stand", prefix: "US", full: "4", small: "US", status: "Active" },
    { type: "V & T Railroad", prefix: "VT", full: "4", small: "VT", status: "Active" },
    { type: "Values Life", prefix: "VL", full: "4", small: "VT", status: "Discontinued*" },
    { type: "Vegas Golden Knights", prefix: "GK", full: "4", small: "GK", status: "Active" },
    { type: "Veteran - Air Force", prefix: "VF", full: "4", small: "AF", status: "Active" },
    { type: "Veteran - Army", prefix: "VA", full: "4", small: "AS", status: "Active" },
    { type: "Veteran - Army Airborne", prefix: "VA", full: "4", small: "AS", status: "Active" }
];

let pinnedCodes = JSON.parse(localStorage.getItem('pinnedNRS') || '[]');
let activeFilter = 'all';
let deferredPrompt = null;

// Handle PWA Install Prompt
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) installBtn.style.display = 'block';
});

async function triggerPWAInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User choice: ${outcome}`);
    deferredPrompt = null;
    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) installBtn.style.display = 'none';
}

window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) installBtn.style.display = 'none';
});

// Render Function
function renderApp() {
    const listContainer = document.getElementById('statute-list');
    const searchVal = document.getElementById('search-input').value.toLowerCase();
    listContainer.innerHTML = '';

    if (activeFilter === 'plates') {
        const filteredPlates = plateDatabase.filter(p => 
            p.type.toLowerCase().includes(searchVal) || 
            p.prefix.toLowerCase().includes(searchVal) ||
            p.small.toLowerCase().includes(searchVal)
        );

        if (filteredPlates.length === 0) {
            listContainer.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-muted);">No matching Nevada license plate types found.</div>';
            return;
        }

        const tableCard = document.createElement('div');
        tableCard.className = 'statute-card';
        tableCard.style.cursor = 'default';
        tableCard.innerHTML = `
            <div class="card-header">
                <span class="statute-num" style="color:#a855f7;">NEVADA DMV SPECIALTY LICENSE PLATES</span>
                <span class="severity-badge badge-plate">87 TYPES DECODED</span>
            </div>
            <div class="statute-summary" style="margin-bottom:12px;">
                Full-size plates allow 4-5 characters plus prefix. Small/motorcycle plates allow 3 characters except Lake Tahoe (4) and Old Timer (2).
            </div>
            <table class="plate-table">
                <thead>
                    <tr>
                        <th>Plate Type / Organization</th>
                        <th>Prefix</th>
                        <th>Full Size Max</th>
                        <th>Small / Moto</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredPlates.map(p => `
                        <tr>
                            <td><strong>${p.type}</strong></td>
                            <td style="color:var(--accent); font-weight:700;">${p.prefix}</td>
                            <td>${p.full} chars</td>
                            <td>${p.small}</td>
                            <td style="color:${p.status.includes('Discontinued') ? '#ef4444' : '#22c55e'}; font-weight:600;">${p.status}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        listContainer.appendChild(tableCard);
        return;
    }

    // Filter Statutes & Local Codes
    const filteredStatutes = statutes.filter(s => {
        const matchesSearch = s.code.toLowerCase().includes(searchVal) ||
                              s.title.toLowerCase().includes(searchVal) ||
                              s.summary.toLowerCase().includes(searchVal) ||
                              s.noc.toLowerCase().includes(searchVal) ||
                              s.booking.toLowerCase().includes(searchVal);

        let matchesFilter = true;
        if (activeFilter === 'pinned') matchesFilter = pinnedCodes.includes(s.code);
        else if (activeFilter === 'felony') matchesFilter = s.level.includes('FEL');
        else if (activeFilter === 'misd') matchesFilter = s.level.includes('MISD');
        else if (activeFilter === 'parking') matchesFilter = s.category === 'parking' || s.title.toLowerCase().includes('parking') || s.title.toLowerCase().includes('tow') || s.code.includes('331') || s.code.includes('484B.4') || s.code.includes('484B.5');
        else if (activeFilter !== 'all') matchesFilter = s.category === activeFilter;

        return matchesSearch && matchesFilter;
    });

    if (filteredStatutes.length === 0) {
        listContainer.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-muted);">No matching statutes or codes found.</div>';
        return;
    }

    filteredStatutes.forEach(s => {
        const card = document.createElement('div');
        card.className = 'statute-card';
        const isPinned = pinnedCodes.includes(s.code);

        card.innerHTML = `
            <div class="card-header">
                <span class="statute-num">${s.code}</span>
                <div>
                    <span class="severity-badge ${s.badge}">${s.level}</span>
                    <button class="pin-btn ${isPinned ? 'pinned' : ''}" onclick="togglePin(event, '${s.code}')">⭐</button>
                </div>
            </div>
            <div class="statute-title">${s.title}</div>
            <div class="statute-summary">${s.summary}</div>
            <div class="codes-bar">
                <span>NOC: ${s.noc}</span>
                <span>BOOKING: ${s.booking}</span>
            </div>
            <div class="details">
                <div class="detail-section">
                    <strong>REQUIRED LEGAL ELEMENTS:</strong>
                    <ul>
                        ${s.elements.map(el => `<li>${el}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;

        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('pin-btn')) return;
            const detailsDiv = card.querySelector('.details');
            detailsDiv.classList.toggle('open');
        });

        listContainer.appendChild(card);
    });
}

function togglePin(event, code) {
    event.stopPropagation();
    if (pinnedCodes.includes(code)) {
        pinnedCodes = pinnedCodes.filter(c => c !== code);
    } else {
        pinnedCodes.push(code);
    }
    localStorage.setItem('pinnedNRS', JSON.stringify(pinnedCodes));
    renderApp();
}

document.getElementById('search-input').addEventListener('input', renderApp);

document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        e.target.classList.add('active');
        activeFilter = e.target.getAttribute('data-filter');
        renderApp();
    });
});

renderApp();

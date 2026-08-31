def generate_ai_recommendation(
    famous_destination,
    hidden_destination,
    visitor_shift_percentage,
    overcrowding_impact,
    employment_impact,
    local_purchase_impact,
    government_profit_impact,
    water_saving,
    waste_impact,
    pollution_impact,
    accessibility_score,
):
    # -----------------------------------------
    # Calculate recommendation level
    # -----------------------------------------

    score = 0

    if overcrowding_impact > 0:
        score += 25

    if accessibility_score >= 70:
        score += 25
    elif accessibility_score >= 40:
        score += 15

    if employment_impact > 0:
        score += 15

    if local_purchase_impact > 0:
        score += 10

    if government_profit_impact > 0:
        score += 10

    if water_saving > 0:
        score += 5

    if waste_impact > 0:
        score += 5

    if pollution_impact > 0:
        score += 5

    if score >= 75:
        decision = "RECOMMENDED"
    elif score >= 50:
        decision = "CAUTION"
    else:
        decision = "NOT RECOMMENDED"

    # -----------------------------------------
    # Main recommendation
    # -----------------------------------------

    if decision == "RECOMMENDED":
        opening = (
            f"RECOMMENDED: A {visitor_shift_percentage:.0f}% redistribution "
            f"from {famous_destination} to {hidden_destination} is advisable."
        )
    elif decision == "CAUTION":
        opening = (
            f"CAUTION: A {visitor_shift_percentage:.0f}% redistribution "
            f"from {famous_destination} to {hidden_destination} may be "
            "implemented gradually."
        )
    else:
        opening = (
            f"NOT RECOMMENDED: A {visitor_shift_percentage:.0f}% "
            f"redistribution from {famous_destination} to "
            f"{hidden_destination} should not be implemented at scale yet."
        )

    # -----------------------------------------
    # Pressure impact
    # -----------------------------------------

    pressure = (
        f"The redistribution can reduce tourism pressure at "
        f"{famous_destination}."
    )

    # -----------------------------------------
    # Accessibility
    # -----------------------------------------

    if accessibility_score >= 70:
        accessibility = (
            f"{hidden_destination} has strong accessibility "
            f"({accessibility_score:.0f}/100) and can support increased "
            "tourist activity."
        )
    elif accessibility_score >= 40:
        accessibility = (
            f"{hidden_destination} has moderate accessibility "
            f"({accessibility_score:.0f}/100), so visitor growth should "
            "be introduced gradually."
        )
    else:
        accessibility = (
            f"{hidden_destination} has limited accessibility "
            f"({accessibility_score:.0f}/100), requiring infrastructure "
            "improvements before significant visitor growth."
        )

    # -----------------------------------------
    # Economic impact
    # -----------------------------------------

    economic = ""

    if employment_impact > 0 or local_purchase_impact > 0:
        economic = (
            "The strategy can support local employment, businesses and "
            "community tourism income."
        )

    # -----------------------------------------
    # Environmental impact
    # -----------------------------------------

    environmental = ""

    if water_saving > 0 or waste_impact > 0 or pollution_impact > 0:
        environmental = (
            "It can also reduce environmental pressure through lower "
            "water consumption, waste generation and pollution at the "
            "overcrowded destination."
        )

    # -----------------------------------------
    # Government action
    # -----------------------------------------

    if decision == "RECOMMENDED":
        action = (
            "Government action: implement the redistribution in phases "
            "and continuously monitor visitor pressure, infrastructure, "
            "water use, waste and pollution."
        )
    elif decision == "CAUTION":
        action = (
            "Government action: begin with a smaller visitor shift and "
            "monitor infrastructure and accessibility before expanding."
        )
    else:
        action = (
            "Government action: improve destination infrastructure and "
            "accessibility before increasing tourist redistribution."
        )

    return " ".join(
        part
        for part in [
            opening,
            pressure,
            accessibility,
            economic,
            environmental,
            action,
        ]
        if part
    )
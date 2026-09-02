'use client'
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Select from 'react-select';
import { FiMapPin, FiGlobe, FiBriefcase } from "../assets/icons/vander"
import { COUNTRY_OPTIONS, cityOptionsFor } from "../../lib/countryCities";
import { EXPERIENCE_OPTIONS } from "../../lib/experience";

// _helper.scss only styles the enabled/focused react-select control classes, so
// the disabled City select fell back to library defaults (wrong bg, border,
// height). Pin the control look here so enabled and disabled match.
const selectStyles = {
    control: (base) => ({
        ...base,
        minHeight: 60,
        height: 60,
        backgroundColor: '#f8f9fc', // $light
        border: 'none',
        boxShadow: 'none',
    }),
    // Nudge the value AND the typing caret/text past the absolutely-positioned
    // .filter-search-form icon (same 48px the SCSS already gives the placeholder).
    // Passing a styles fn changes react-select's generated class hash, so the
    // `margin: 0 !important` rules in _helper.scss stop matching these two.
    singleValue: (base) => ({ ...base, marginLeft: 48 }),
    input: (base) => ({ ...base, marginLeft: 48 }),
};

export default function FormSelect(){
    const router = useRouter();
    const searchParams = useSearchParams();

    // Seed from the URL so the filter reflects the current results on reload.
    const [country, setCountry] = useState(searchParams.get('country') ?? '');
    const [city, setCity] = useState(searchParams.get('city') ?? '');
    const [experience, setExperience] = useState(searchParams.get('experience') ?? '');

    const selectedCountry = COUNTRY_OPTIONS.find((o) => o.value === country) ?? null;
    // City list is derived from the chosen country — no country => empty => disabled.
    const cityOptions = cityOptionsFor(country);
    const selectedCity = cityOptions.find((o) => o.value === city) ?? null;
    const selectedExperience = EXPERIENCE_OPTIONS.find((o) => o.value === experience) ?? null;

    const handleCountryChange = (option) => {
        setCountry(option?.value ?? '');
        setCity(''); // reset city whenever the country changes
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const params = new URLSearchParams();
        if (country) params.set('country', country);
        if (city) params.set('city', city);
        if (experience) params.set('experience', experience);

        router.push(`/jobs${params.toString() ? `?${params.toString()}` : ''}`);
    };

    // Button state, derived every render from the applied filter (URL) vs the
    // current form:
    //   - dirty      => the form no longer matches the applied results, because
    //                   any field was added, changed, OR removed
    //   - anyApplied => a filter is currently applied to the results
    // Show "Clear" only when a filter is applied AND the form still matches it
    // exactly. In every other case show "Search", so a new filter combination
    // can be applied immediately and repeatedly — never "Clear" first.
    const appliedCountry = searchParams.get('country') ?? '';
    const appliedCity = searchParams.get('city') ?? '';
    const appliedExperience = searchParams.get('experience') ?? '';

    const dirty =
        country !== appliedCountry ||
        city !== appliedCity ||
        experience !== appliedExperience;
    const anyApplied = Boolean(appliedCountry || appliedCity || appliedExperience);

    const showClear = anyApplied && !dirty;

    const handleClear = () => {
        setCountry('');
        setCity('');
        setExperience('');
        router.push('/jobs');
    };

    return (
        <form className="card-body text-start" onSubmit={handleSubmit}>
            <div className="registration-form text-dark text-start">
                {/* g-2 = gutter (padding, no width added) + never wrap on lg, so the
                    selects and the button stay on one row (4 + 3 + 3 + 2 = 12 cols). */}
                <div className="row g-2 flex-lg-nowrap">
                    <div className="col-lg-4 col-md-6 col-12">
                        <div className="mb-3 mb-sm-0">
                            <label className="form-label d-none fs-6">Country :</label>
                            <div className="filter-search-form position-relative filter-border">
                                <FiGlobe className="fea icon-20 icons"/>
                                <Select
                                    options={COUNTRY_OPTIONS}
                                    value={selectedCountry}
                                    onChange={handleCountryChange}
                                    styles={selectStyles}
                                    isClearable
                                    placeholder="Select country"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6 col-12">
                        <div className="mb-3 mb-sm-0">
                            <label className="form-label d-none fs-6">City :</label>
                            <div className="filter-search-form position-relative filter-border">
                                <FiMapPin className="fea icon-20 icons"/>
                                <Select
                                    options={cityOptions}
                                    value={selectedCity}
                                    onChange={(option) => setCity(option?.value ?? '')}
                                    styles={selectStyles}
                                    isDisabled={!country}
                                    isClearable
                                    placeholder={country ? "Select city" : "Select country first"}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6 col-12">
                        <div className="mb-3 mb-sm-0">
                            <label className="form-label d-none fs-6">Experience :</label>
                            <div className="filter-search-form position-relative filter-border">
                                <FiBriefcase className="fea icon-20 icons"/>
                                <Select
                                    options={EXPERIENCE_OPTIONS}
                                    value={selectedExperience}
                                    onChange={(option) => setExperience(option?.value ?? '')}
                                    styles={selectStyles}
                                    isClearable
                                    placeholder="Any experience"
                                />
                            </div>
                        </div>
                    </div>

                    {/* One slot, one button — mutually exclusive, never both. */}
                    <div className="col-lg-2 col-md-6 col-12">
                        {showClear ? (
                            <button type="button" onClick={handleClear} style={{height:'60px'}} className="btn btn-soft-primary w-100">Clear</button>
                        ) : (
                            <input type="submit" id="search" name="search" style={{height:'60px'}} className="btn btn-primary searchbtn w-100" value="Search"/>
                        )}
                    </div>
                </div>
            </div>
        </form>
    )
}

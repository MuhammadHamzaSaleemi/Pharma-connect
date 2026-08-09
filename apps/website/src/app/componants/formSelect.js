'use client'
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Select from 'react-select';
import {FiBriefcase, FiMapPin, FiSearch} from "../assets/icons/vander"
import { WORK_TYPE_VALUES } from "../../services/jobs/jobs.types";
import { enumToOptions } from "../../lib/enumOptions";

const typeOptions = enumToOptions(WORK_TYPE_VALUES);

export default function FormSelect(){
    const router = useRouter();
    const searchParams = useSearchParams();

    const [keyword, setKeyword] = useState(searchParams.get('search') ?? '');
    const [city, setCity] = useState(searchParams.get('city') ?? '');
    const [workType, setWorkType] = useState(searchParams.get('workType') ?? '');

    const selectedType = typeOptions.find((option) => option.value === workType) ?? null;

    const handleSubmit = (event) => {
        event.preventDefault();

        const params = new URLSearchParams();
        if (keyword.trim()) params.set('search', keyword.trim());
        if (city.trim()) params.set('city', city.trim());
        if (workType) params.set('workType', workType);

        router.push(`/jobs${params.toString() ? `?${params.toString()}` : ''}`);
    };

    return(
        <>
            <form className="card-body text-start" onSubmit={handleSubmit}>
                <div className="registration-form text-dark text-start">
                    <div className="row gap-2 g-lg-0">
                        <div className="col-lg-3 col-md-6 col-12">
                            <div className="mb-3 mb-sm-0">
                                <label className="form-label d-none fs-6">Search :</label>
                                <div className="filter-search-form position-relative filter-border">
                                    <FiSearch className="fea icon-20 icons"/>
                                    <input
                                        name="name"
                                        type="text"
                                        id="job-keyword"
                                        className="form-control filter-input-box bg-light border-0"
                                        placeholder="Search your keaywords"
                                        value={keyword}
                                        onChange={(event) => setKeyword(event.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 col-12">
                            <div className="mb-3 mb-sm-0">
                                <label className="form-label d-none fs-6">Location:</label>
                                <div className="filter-search-form position-relative filter-border">
                                    <FiMapPin className="fea icon-20 icons"/>
                                    <input
                                        name="city"
                                        type="text"
                                        id="job-city"
                                        className="form-control filter-input-box bg-light border-0"
                                        placeholder="City e.g. Lahore"
                                        value={city}
                                        onChange={(event) => setCity(event.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 col-12">
                            <div className="mb-3 mb-sm-0">
                                <label className="form-label d-none fs-6">Type :</label>
                                <div className="filter-search-form relative filter-border">
                                    <FiBriefcase className="fea icon-20 icons"/>
                                    <Select
                                        options={typeOptions}
                                        value={selectedType}
                                        onChange={(option) => setWorkType(option?.value ?? '')}
                                        isClearable
                                        placeholder="Any type"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-2 col-md-6 col-12">
                            <input type="submit" id="search" name="search" style={{height:'60px'}} className="btn btn-primary searchbtn w-100" value="Search"/>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

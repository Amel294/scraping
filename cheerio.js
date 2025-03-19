const cheerio = require("cheerio");

function extractJobDataFromNaukri(html) {
    const $ = cheerio.load(html);
    
    return {
        jobHeader: {
            title: $(".styles_jd-header-title__rZwM1").text().trim(),
            company: $(".styles_jd-header-comp-name__MvqAI a").text().trim(),
            experience: $(".styles_jhc__exp__k_giM span").text().trim(),
            salary: $(".styles_jhc__salary__jdfEC span").text().trim(),
            location: $(".styles_jhc__location__W_pVs a").map((i, el) => $(el).text().trim()).get(),
            postedDate: $(".styles_jhc__stat__PgY67").first().find("span").text().trim(),
            openings: parseInt($(".styles_jhc__stat__PgY67").eq(1).find("span").text().trim()) || "N/A",
            applicants: parseInt($(".styles_jhc__stat__PgY67").eq(2).find("span").text().trim()) || "N/A",
            jobType: "In-office",  // Assuming in-office since no remote indicator
            hiringOfficeElement : headerDoc.querySelector(".styles_jhc__wfht__WWyAx"),
            isRemoteHiringOffice : hiringOfficeElement && hiringOfficeElement.textContent.includes("Remote"),
        
        },
        jobDescription: {
            description: $(".styles_JDC__dang-inner-html__h0K4t").text().trim(),
            role: $(".styles_details__Y424J").eq(0).find("a").text().trim(),
            industryType: $(".styles_details__Y424J").eq(1).find("a").text().trim(),
            department: $(".styles_details__Y424J").eq(2).find("a").text().trim(),
            employmentType: $(".styles_details__Y424J").eq(3).find("span").text().trim(),
            roleCategory: $(".styles_details__Y424J").eq(4).find("span").text().trim(),
            education: $(".styles_education__KXFkO .styles_details__Y424J span").text().trim().split(", "),
            skills: $(".styles_key-skill__GIPn_ .styles_chip__7YCfG span").map((i, el) => $(el).text().trim()).get()
        }
    };
}

module.exports = extractJobDataFromNaukri;
// const response ={
//     "jobHeader": "<div class=\"styles_jhc__top__BUxpc\"><div class=\"styles_jhc__jd-top-head__MFoZl\"><header><h1 class=\"styles_jd-header-title__rZwM1\" title=\"Looking For Fresher Btech (CSC,EEE,ECE) Graduates\">Looking For Fresher Btech (CSC,EEE,ECE) Graduates</h1></header><div class=\"styles_jd-header-comp-name__MvqAI\"><a href=\"https://www.naukri.com/vedamcloud-technologies-jobs-careers-6198440?src=jddesktop\" target=\"_blank\" title=\"Vedamcloud Technologies Careers\">Vedamcloud Technologies</a><div class=\"styles_rating-wrapper__jPmOo\"></div></div></div><a href=\"https://www.naukri.com/vedamcloud-technologies-jobs-careers-6198440?src=jddesktop\" target=\"_blank\"><img alt=\"Company Logo\" loading=\"lazy\" width=\"70\" height=\"70\" decoding=\"async\" data-nimg=\"1\" class=\"styles_jhc__comp-banner__ynBvr\" srcset=\"https://img.naukimg.com/logo_images/groups/v1/8317171.gif 1x, https://img.naukimg.com/logo_images/groups/v1/8317171.gif 2x\" src=\"https://img.naukimg.com/logo_images/groups/v1/8317171.gif\" style=\"color: transparent;\"></a><div class=\"styles_jhc__left__tg9m8\"><div class=\"styles_jhc__exp-salary-container__NXsVd\"><div class=\"styles_jhc__exp__k_giM\"><i class=\"ni-icon-bag\"></i><span>0 years</span></div><span class=\"styles_jhc__grey-separator__2K9Aw\"></span><div class=\"styles_jhc__salary__jdfEC\"><i class=\"ni-icon-salary\"></i><span>2.25-6 Lacs P.A. </span></div></div><div class=\"styles_jhc__loc___Du2H\"><i class=\"ni-icon-location\"></i><span class=\"styles_jhc__location__W_pVs\"><a target=\"_blank\" href=\"https://www.naukri.com/jobs-in-hyderabad-secunderabad\" title=\" Jobs in Hyderabad\">Hyderabad</a>, <a target=\"_blank\" href=\"https://www.naukri.com/jobs-in-bangalore\" title=\" Jobs in Bengaluru\">Bengaluru</a></span></div></div><div class=\"styles_jhc__right___xFCM\"><div class=\"styles_jhc__send-job__l7b_v\"><a id=\"smjltButton\" title=\"Create a Job Alert\" target=\"_blank\">Send me jobs like this</a></div></div></div><div class=\"styles_jhc__bottom__DrTmB\"><div class=\"styles_jhc__jd-stats__KrId0\"><span class=\"styles_jhc__stat__PgY67\"><label>Posted: </label><span>5 days ago</span></span><span class=\"styles_jhc__stat__PgY67\"><label>Openings: </label><span>1</span></span><span class=\"styles_jhc__stat__PgY67\"><label>Applicants: </label><span>9850</span></span></div><div class=\"styles_jhc__apply-button-container__5Bqnb\"><button id=\"reg-apply-button\" class=\"styles_reg-apply-button__lUN1u reg-apply-button\">Register to apply</button><button id=\"login-apply-button\" class=\"styles_login-apply-button__quzj4 login-apply-button undefined\">Login to apply</button></div></div>",
//     "jobDescription": "<div class=\"\"><h2>Job description</h2></div><div class=\"\"><div class=\"styles_JDC__dang-inner-html__h0K4t\">Looking for Fresher Btech (CSC,EEE,ECE) Graduates who are passed out only in 2023 , 2024 <br>to work in SQL,Oracle Cloud ERP</div><div class=\"styles_other-details__oEN4O\"><div class=\"styles_details__Y424J\"><label>Role: </label><span><a href=\"https://www.naukri.com/database-developer-engineer-jobs\" target=\"_blank\">Database Developer / Engineer</a><span class=\"styles_comma__6l5nn\">,</span></span></div><div class=\"styles_details__Y424J\"><label>Industry Type: </label><span><a href=\"https://www.naukri.com/it-services-consulting-jobs\" target=\"_blank\">IT Services &amp; Consulting</a><span class=\"styles_comma__6l5nn\">,</span></span></div><div class=\"styles_details__Y424J\"><label>Department: </label><span><a href=\"https://www.naukri.com/engineering-software-qa-jobs\" target=\"_blank\">Engineering - Software &amp; QA</a><span class=\"styles_comma__6l5nn\">,</span></span></div><div class=\"styles_details__Y424J\"><label>Employment Type: </label><span><span>Full Time, Permanent</span></span></div><div class=\"styles_details__Y424J\"><label>Role Category: </label><span><span>DBA / Data warehousing</span></span></div></div><div class=\"styles_education__KXFkO\"><div class=\"styles_heading__veHpg\">Education</div><div class=\"styles_details__Y424J\"><label>UG: </label><span class=\"\">B.Tech/B.E. in Electronics/Telecommunication, Information Technology, Computers</span></div></div></div><div class=\"styles_key-skill__GIPn_\"><div class=\"styles_heading__veHpg\">Key Skills</div><div class=\"styles_legend__DVbef\">Skills highlighted with ‘<i class=\"ni-icon-jd-save\"></i>‘ are preferred keyskills</div><div><a href=\"https://www.naukri.com/sql-development-jobs\" target=\"_blank\" class=\"styles_chip__7YCfG styles_clickable__dUW8S\"><i class=\"ni-icon-jd-save\"></i><span>SQL Development</span></a></div><div><a href=\"https://www.naukri.com/sql-queries-jobs\" target=\"_blank\" class=\"styles_chip__7YCfG styles_clickable__dUW8S\"><span>SQL Queries</span></a><a href=\"https://www.naukri.com/python-jobs\" target=\"_blank\" class=\"styles_chip__7YCfG styles_clickable__dUW8S\"><span>Python</span></a></div></div>"
// }
// console.log(extractJobDataFromNaukri(`${response.jobHeader}${response.jobDescription}`))

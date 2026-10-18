import { plainToInstance } from 'class-transformer';
import { CreateBlogDto } from '../../modules/blogs/dto/create-blog.dto';
import { CreateJobDto } from '../../modules/jobs/dto/create-job.dto';
import { UpdateScholarshipDto } from '../../modules/scholarships/dto/update-scholarship.dto';

const PAYLOAD =
  '<p onclick="steal()">Hi <strong>there</strong></p><script>alert(1)</script>' +
  '<img src=x onerror="steal()"><a href="javascript:steal()">bad</a>' +
  '<a href="https://example.com" target="_blank" rel="noopener">ok</a>';
const CLEAN =
  '<p>Hi <strong>there</strong></p><a>bad</a>' +
  '<a href="https://example.com" target="_blank" rel="noopener">ok</a>';

describe('SanitizeHtml', () => {
  it('strips scripts, handlers and javascript: links but keeps editor markup', () => {
    expect(plainToInstance(CreateBlogDto, { content: PAYLOAD }).content).toBe(CLEAN);
  });

  // Excel bulk upload builds CreateJobDto with plainToInstance, not the ValidationPipe.
  it('applies to job descriptions built outside the request pipeline', () => {
    expect(plainToInstance(CreateJobDto, { jobDescription: PAYLOAD }).jobDescription).toBe(CLEAN);
  });

  it('is inherited by PartialType update DTOs', () => {
    const dto = plainToInstance(UpdateScholarshipDto, { howToApply: PAYLOAD });
    expect(dto.howToApply).toBe(CLEAN);
  });
});

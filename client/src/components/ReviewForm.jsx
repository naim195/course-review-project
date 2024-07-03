import {
  Grid,
  Typography,
  TextField,
  Button,
  Slider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import { Controller } from "react-hook-form";
import PropTypes from "prop-types";

ReviewForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  courseData: PropTypes.object.isRequired,
};

export function ReviewForm({
  handleSubmit,
  onSubmit,
  control,
  errors,
  register,
  courseData,
}) {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography id="overallRating-slider" gutterBottom>
            Overall Rating
          </Typography>
          <Controller
            name="rating"
            control={control}
            rules={{
              required: true,
              min: 0.5,
              max: 5,
            }}
            render={({ field }) => (
              <Slider
                {...field}
                value={field.value || 0}
                onChange={(_, newValue) => field.onChange(newValue)}
                min={0}
                max={5}
                step={0.5}
                marks
                valueLabelDisplay="auto"
                className="mb-2"
              />
            )}
          />
          {errors.rating && (
            <Typography color="error">
              Overall Rating is required and must be between 0.5 and 5.
            </Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography id="effortForGoodGrade-slider" gutterBottom>
            Effort Required for Good Grade
          </Typography>
          <Controller
            name="effortForGoodGrade"
            control={control}
            rules={{
              required: true,
              min: 1,
              max: 5,
            }}
            render={({ field }) => (
              <Slider
                {...field}
                value={field.value || 0}
                onChange={(_, newValue) => field.onChange(newValue)}
                min={0}
                max={5}
                step={1}
                marks
                valueLabelDisplay="auto"
                className="mb-2"
              />
            )}
          />
          {errors.effortForGoodGrade && (
            <Typography color="error">
              Effort Required for Good Grade is required and must be between 1
              and 5.
            </Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography id="overallDifficulty-slider" gutterBottom>
            Overall Difficulty
          </Typography>
          <Controller
            name="overallDifficulty"
            control={control}
            rules={{
              required: true,
              min: 1,
              max: 5,
            }}
            render={({ field }) => (
              <Slider
                {...field}
                value={field.value || 0}
                onChange={(_, newValue) => field.onChange(newValue)}
                min={0}
                max={5}
                step={1}
                marks
                valueLabelDisplay="auto"
                className="mb-2"
              />
            )}
          />
          {errors.overallDifficulty && (
            <Typography color="error">
              Overall Difficulty is required and must be between 1 and 5.
            </Typography>
          )}
        </Grid>

        <Grid item xs={12}>
          <Typography id="instructorRating-slider" gutterBottom>
            Instructor Rating
          </Typography>
          {courseData.instructor &&
            courseData.instructor.map((instructor, index) => (
              <div key={instructor._id || index}>
                <Typography>{instructor.name}</Typography>
                <Controller
                  name={`instructorRating.${index}.rating`}
                  control={control}
                  rules={{
                    required: true,
                    min: 1,
                    max: 5,
                  }}
                  render={({ field }) => (
                    <Slider
                      {...field}
                      value={field.value || 0}
                      onChange={(_, newValue) => field.onChange(newValue)}
                      min={0}
                      max={5}
                      step={1}
                      marks
                      valueLabelDisplay="auto"
                      className="mb-2"
                    />
                  )}
                />
                {errors.instructorRating &&
                  errors.instructorRating[index]?.rating && (
                    <Typography color="error">
                      Instructor Rating for {instructor.name} is required and
                      must be between 1 and 5.
                    </Typography>
                  )}
                <Controller
                  name={`instructorRating.${index}.name`}
                  control={control}
                  defaultValue={instructor.name}
                  render={({ field }) => <TextField {...field} type="hidden" />}
                />
              </div>
            ))}
        </Grid>

        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Grade</FormLabel>
            <Controller
              name="grade"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <RadioGroup {...field} row>
                  {["A", "A-", "B", "B-", "C", "C-", "D", "E"].map((grade) => (
                    <FormControlLabel
                      key={grade}
                      value={grade}
                      control={<Radio />}
                      label={grade}
                    />
                  ))}
                </RadioGroup>
              )}
            />
            {errors.grade && (
              <Typography color="error">Grade is required.</Typography>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Text Review (optional)"
            name="textReview"
            {...register("textReview", {
              minLength: 5,
              maxLength: 1000,
            })}
            fullWidth
            multiline
            rows={4}
            className="mb-2"
          />
          {errors.textReview && (
            <Typography color="error">
              Text Review must be between 5 and 1000 characters.
            </Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit">
            Submit Review
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

import test from "ava";
import Eleventy from "../src/Eleventy";
import templateConfig from "../src/Config";

const config = templateConfig.getConfig();

test("Eleventy, defaults inherit from config", async t => {
  let elev = new Eleventy();

  t.truthy(elev.input);
  t.truthy(elev.outputDir);
  t.is(elev.input, config.dir.input);
  t.is(elev.outputDir, config.dir.output);
});

test("Eleventy, get version", t => {
  let elev = new Eleventy();

  t.truthy(elev.getVersion());
});

test("Eleventy, get help", t => {
  let elev = new Eleventy();

  t.truthy(elev.getHelp());
});

test("Eleventy, set is verbose", t => {
  let elev = new Eleventy();
  elev.setIsVerbose(true);

  t.true(elev.isVerbose);
});

test("Eleventy set input/output", async t => {
  let elev = new Eleventy("./test/stubs", "./test/stubs/_site");

  t.is(elev.input, "./test/stubs");
  t.is(elev.outputDir, "./test/stubs/_site");

  await elev.init();
  t.truthy(elev.templateData);
  t.truthy(elev.writer);
});

test("Eleventy set input/output, one file input", async t => {
  let elev = new Eleventy("./test/stubs/index.html", "./test/stubs/_site");

  t.is(elev.input, "./test/stubs/index.html");
  t.is(elev.inputDir, "./test/stubs");
  t.is(elev.outputDir, "./test/stubs/_site");
});

test("Eleventy set input/output, one file input root dir", async t => {
  let elev = new Eleventy("./README.md", "./test/stubs/_site");

  t.is(elev.input, "./README.md");
  t.is(elev.inputDir, ".");
  t.is(elev.outputDir, "./test/stubs/_site");
});

test("Eleventy set input/output, one file input root dir without leading dot/slash", async t => {
  let elev = new Eleventy("README.md", "./test/stubs/_site");

  t.is(elev.input, "README.md");
  t.is(elev.inputDir, ".");
  t.is(elev.outputDir, "./test/stubs/_site");
});

test("Eleventy set input/output, one file input exitCode", async t => {
  let previousExitCode = process.exitCode;
  let elev = new Eleventy(
    "./test/stubs/exitCode/failure.njk",
    "./test/stubs/exitCode/_site"
  );

  // TODO make this output quieter
  elev.setLogger({
    log: function() {},
    warn: function() {},
    error: function() {}
  });

  await elev.init();
  await elev.write();

  t.is(process.exitCode, 1);

  process.exitCode = previousExitCode;
});

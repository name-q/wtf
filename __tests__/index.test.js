test("test process", () => {
    expect(typeof process.env.PWD).toBe('string');
});